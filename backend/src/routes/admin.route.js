import {Router} from "express";
import { createProduct, getAllCustomers, getAllOrders, getAllProducts, getDashboardStats, updateOrderStatus, updateProduct } from "../controllers/admin.controller.js";
import { adminOnly, protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { get } from "mongoose";

const router = Router();

router.use(protectRoute, adminOnly);

router.post("/product", upload.array("images", 3), createProduct); 
router.get("/product", getAllProducts);
router.put("/product/:id", upload.array("images", 3),updateProduct);

router.get("/orders", getAllOrders);
router.patch("/order/:id/status", updateOrderStatus) 

router.get("/customers", getAllCustomers);

router.get("/stats", getDashboardStats);

export default router;