import {Router} from "express";
import { createProduct, deleteProduct, getAllCustomers, getAllOrders, getAllProducts, getDashboardStats, updateOrderStatus, updateProduct } from "../controllers/admin.controller.js";
import { adminOnly, protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.use(protectRoute, adminOnly);

router.post("/products", upload.array("images", 3), createProduct);
router.get("/products", getAllProducts);
router.put("/products/:id", upload.array("images", 3), updateProduct);
router.delete("/products/:id", deleteProduct);

// Backward-compatible aliases for any existing callers still using the singular paths.
router.post("/product", upload.array("images", 3), createProduct); 
router.get("/product", getAllProducts);
router.put("/product/:id", upload.array("images", 3), updateProduct);
router.delete("/product/:id", deleteProduct);

router.get("/orders", getAllOrders);
router.patch("/orders/:id/status", updateOrderStatus);
router.patch("/order/:id/status", updateOrderStatus);

router.get("/customers", getAllCustomers);

router.get("/stats", getDashboardStats);

export default router;
