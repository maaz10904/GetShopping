import Stripe from "stripe";
import { ENV } from "../config/env.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";

const SHIPPING_FEE = 100;
const TAX_RATE = 0.18;
const STRIPE_CURRENCY = "inr";

async function createOrderFromPaymentIntent(paymentIntent) {
  const { userId, clerkId, orderItems, shippingAddress, totalPrice } = paymentIntent.metadata || {};

  if (!userId || !clerkId || !orderItems || !shippingAddress || !totalPrice) {
    throw new Error("Payment intent is missing order metadata");
  }

  const existingOrder = await Order.findOne({ "paymentResult.id": paymentIntent.id }).populate(
    "orderItems.product"
  );
  if (existingOrder) {
    return existingOrder;
  }

  const items = JSON.parse(orderItems);
  const order = await Order.create({
    user: userId,
    clerkId,
    orderItems: items,
    shippingAddress: JSON.parse(shippingAddress),
    paymentResult: {
      id: paymentIntent.id,
      status: paymentIntent.status,
      currency: paymentIntent.currency,
    },
    totalPrice: parseFloat(totalPrice),
  });

  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  await order.populate("orderItems.product");
  return order;
}

export async function createPaymentIntent(req, res) {
  try {
    const { cartItems, shippingAddress } = req.body;
    const user = req.user;

    if (!ENV.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: "Stripe secret key is not configured on the server" });
    }

    const stripe = new Stripe(ENV.STRIPE_SECRET_KEY);

    // Validate cart items
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    if (
      !shippingAddress?.fullName ||
      !shippingAddress?.streetAddress ||
      !shippingAddress?.city ||
      !shippingAddress?.state ||
      !shippingAddress?.zipCode ||
      !shippingAddress?.phoneNumber
    ) {
      return res.status(400).json({ error: "Complete shipping address is required" });
    }

    // Calculate total from server-side (don't trust client - ever.)
    let subtotal = 0;
    const validatedItems = [];

    for (const item of cartItems) {
      const productId = item.product?._id ?? item.product;
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.product.name} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }

      subtotal += product.price * item.quantity;
      validatedItems.push({
        product: product._id.toString(),
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0],
      });
    }

    const shipping = SHIPPING_FEE;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + shipping + tax;

    if (total <= 0) {
      return res.status(400).json({ error: "Invalid order total" });
    }

    // find or create the stripe customer
    let customer;
    if (user.stripeCustomerId) {
      // find the customer
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      // create the customer
      customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          clerkId: user.clerkId,
          userId: user._id.toString(),
        },
      });

      // add the stripe customer ID to the  user object in the DB
      await User.findByIdAndUpdate(user._id, { stripeCustomerId: customer.id });
    }

    // create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Stripe expects INR in paise
      currency: STRIPE_CURRENCY,
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        clerkId: user.clerkId,
        userId: user._id.toString(),
        orderItems: JSON.stringify(validatedItems),
        shippingAddress: JSON.stringify(shippingAddress),
        totalPrice: total.toFixed(2),
        currency: STRIPE_CURRENCY,
      },
      // in the webhooks section we will use this metadata
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      totalPrice: total.toFixed(2),
      currency: STRIPE_CURRENCY,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
}

export async function confirmPaymentOrder(req, res) {
  try {
    const { paymentIntentId } = req.body;
    const user = req.user;

    if (!paymentIntentId) {
      return res.status(400).json({ error: "Payment intent ID is required" });
    }

    if (!ENV.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: "Stripe secret key is not configured on the server" });
    }

    const stripe = new Stripe(ENV.STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ error: "Payment has not completed yet" });
    }

    if (paymentIntent.metadata?.clerkId !== user.clerkId) {
      return res.status(403).json({ error: "Payment does not belong to this user" });
    }

    const order = await createOrderFromPaymentIntent(paymentIntent);
    res.status(200).json({ message: "Order confirmed successfully", order });
  } catch (error) {
    console.error("Error confirming payment order:", error);
    res.status(500).json({ error: error.message || "Failed to confirm order" });
  }
}

export async function handleWebhook(req, res) {
  if (!ENV.STRIPE_SECRET_KEY || !ENV.STRIPE_WEBHOOK_SECRET) {
    return res.status(500).json({ error: "Stripe webhook secrets are not configured on the server" });
  }

  const stripe = new Stripe(ENV.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, ENV.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    console.log("Payment succeeded:", paymentIntent.id);

    try {
      const order = await createOrderFromPaymentIntent(paymentIntent);
      console.log("Order created successfully:", order._id);
    } catch (error) {
      console.error("Error creating order from webhook:", error);
    }
  }

  res.json({ received: true });
}
