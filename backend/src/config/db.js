import mongoose from "mongoose";
import mongodb from "mongodb";
import {ENV} from "./env.js";

export const connectDB = async () => {
    try {
        const conn= await mongoose.connect(ENV.DB_URL)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`mongodb Error: ${error.message}`)
        process.exit(1)
    }
}