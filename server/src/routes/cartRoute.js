import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getCart, syncCart, mergeCart } from "../controllers/cartController.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/sync", protect, syncCart);
router.post("/merge", protect, mergeCart);

export default router;
