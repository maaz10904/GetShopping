import { Router } from "express";  
import { addAddress, addToWishlist, deleteAddress, getAddresses, getWishlist, removeFromWishlist, updateAddress } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute);


router.post("/addresses", protectRoute, addAddress);
router.get("/addresses", protectRoute, getAddresses);
router.put("/addresses/:addressId", protectRoute, updateAddress);
router.delete("/addresses/:addressId", protectRoute, deleteAddress);

router.post("/wishlist", addToWishlist);
router.get("/wishlist", getWishlist);
router.delete("/wishlist/:productId", removeFromWishlist);


export default router;