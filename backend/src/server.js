import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import cors from "cors";

import { functions, inngest } from "./config/inngest.js";
import { handleWebhook } from "./controllers/payment.controller.js";

import mongoose from "mongoose";
import { ENV } from "./config/env.js"
import { connectDB } from "./config/db.js";

import adminRoutes from "./routes/admin.route.js"
import userRoutes from "./routes/user.route.js"
import orderRoutes from "./routes/order.route.js"
import reviewRoutes from "./routes/review.route.js"
import productRoutes from "./routes/product.route.js"
import cartRoutes from "./routes/cart.route.js"
import paymentRoutes from "./routes/payment.route.js"

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.post("/api/payments/webhook", express.raw({ type: "application/json" }), handleWebhook);
app.use(express.json());
app.use(clerkMiddleware());
app.use(cors({origin:ENV.CLIENT_URL, credentials: true}));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/inngest", serve({client: inngest, functions}));

app.use("/api/admin",adminRoutes);
app.use("/api/users",userRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/reviews",reviewRoutes);
app.use("/api/products",productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/payments",paymentRoutes);


app.get("/api/health", (req,res)=> {
    res.status(200).json({message:"success "});
});

if(ENV.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../../admin/dist")))

    app.get(/.*/, (req,res)=>{
        res.sendFile(path.join(__dirname,"../../admin/dist/index.html"))
    })
}
async function cleanLegacyOrderIndexes() {
    try {
        const collection = mongoose.connection.collection('orders');
        const indexes = await collection.indexes();
        if (indexes.some(index => index.name === 'orderld_1')) {
            console.warn('Dropping legacy orders.orderld_1 index to prevent duplicate-null order insertion errors');
            await collection.dropIndex('orderld_1');
        }
    } catch (error) {
        console.error('Failed to clean legacy order indexes:', error);
    }
}

const startServer = async () => {
    await connectDB();
    await cleanLegacyOrderIndexes();
    app.listen(ENV.PORT, ()=> {
        console.log('server is up and running');
    })

   } 
startServer();
