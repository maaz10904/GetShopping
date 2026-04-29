import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { confirmPaymentOrder, createPaymentIntent } from "../controllers/payment.controller.js";

const router = Router();

router.post("/create-intent", protectRoute, createPaymentIntent);
router.post("/confirm-order", protectRoute, confirmPaymentOrder);

export default router;
