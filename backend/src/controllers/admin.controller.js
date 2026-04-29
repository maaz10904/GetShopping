import cloudinary from "../config/cloudinary.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";

export async function createProduct(req, res) {
    try {
        const { name, description, price, stock, category } = req.body;
        if (!name || !description || !price || !stock || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "At least one image is required" });
        }
        if (!req.files || req.files.length > 3) {
            return res.status(400).json({ message: "Maximum 3 images are allowed" });
        }

        const uploadPromises = req.files.map((file) => {
            return cloudinary.uploader.upload(file.path, {
                folder: "products",
            });
        });
        const uploadedImages = await Promise.all(uploadPromises);

        const imageUrls = uploadedImages.map((img) => img.secure_url);

        const product = await Product.create({
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock),
            category,
            images: imageUrls,
        })
        res.status(201).json(product);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getAllProducts(_, res) {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const { name, description, price, stock, category } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (name) product.name = name;
        if (description) product.description = description;
        if (price !== undefined) product.price = parseFloat(price);
        if (stock !== undefined) product.stock = parseInt(stock);
        if (category) product.category = category;

// Handle new image uploads
        if (req.files && req.files.length > 0) {
            if (req.files.length > 3) {
                return res.status(400).json({ message: "Maximum 3 images are allowed" });
            }
            const uploadPromises = req.files.map((file) => {
                return cloudinary.uploader.upload(file.path, {
                    folder: "products",
                });
            });
            const uploadedImages = await Promise.all(uploadPromises);
            product.images = uploadedImages.map((img) => img.secure_url);
        }
        await product.save();
        res.status(200).json(product);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getAllOrders(_, res) {
    try {
        const orders = await Order.find()
        .populate("user", "name email")
        .populate("orderItems.product")
        .sort({ createdAt: -1 });
        res.status(200).json({ orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateOrderStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["pending", "shipped", "delivered"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.status = status;

        if (status === "shipped") {
            order.shippedAt = new Date();
        }
        if (status === "delivered") {
            order.deliverAt = new Date();
        }
        await order.save();
        res.status(200).json(order);
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getAllCustomers(_, res) {
    try {
        const customers = await User.find().sort({ createdAt: -1 });
        res.status(200).json(customers);
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getDashboardStats(_, res) {
    try {
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const revenueResult = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;
        const totalCustomers = await User.countDocuments();
        res.status(200).json({
            totalOrders,
            totalRevenue,
            totalProducts,
            totalCustomers,
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
