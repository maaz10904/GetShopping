import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { Review } from "../models/review.model.js";

export async function createOrder(req, res) {
    try {
        const user = req.user;
        const { orderItems, shippingAddress, paymentResult, totalPrice } = req.body;
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: "No order items" });
        }

        if (paymentResult?.id) {
            const existingOrder = await Order.findOne({ "paymentResult.id": paymentResult.id });
            if (existingOrder) {
                return res.status(200).json({ message: "Order already exists", order: existingOrder });
            }
        }

        const validatedItems = [];

        for (const item of orderItems) {
            const productId = item.product?._id ?? item.product;
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            if (product.stock < item.quantity) {
            return res.status(400).json({ message: `Not enough stock for product ${product.name}` });
        }
            validatedItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.images[0],
            });
        }
         const order = await Order.create({
        user: user._id,
        clerkId: user.clerkId,
        orderItems: validatedItems,
        shippingAddress,
        paymentResult,
        totalPrice
        });
            for (const item of validatedItems) {
                await Product.findByIdAndUpdate(item.product, {
                     $inc: { stock: -item.quantity } 
                    });
            }
            await order.populate("orderItems.product");
            res.status(201).json({ message: "Order created successfully", order });
    } 
    catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export async function getUserOrders(req, res) {
    try {
        const orders = await Order.find({clerkId: req.user.clerkId })
        .populate("orderItems.product", "name price")
        .sort({ createdAt: -1 });

        const orderIds = orders.map(order => order._id);
        const reviews = await Review.find({ order: { $in: orderIds } });
        const reviewedOrderIds = new Set(reviews.map(review => review.order.toString()));

        const ordersWithReviewStatus = await Promise.all(
      orders.map(async (order) => {
        return {
          ...order.toObject(),
          hasReviewed: reviewedOrderIds.has(order._id.toString()),
        };
      })
    );

        res.status(200).json({orders: ordersWithReviewStatus});
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
