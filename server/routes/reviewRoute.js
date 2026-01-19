import express from "express";
const router = express.Router();
import {
  verifyToken,
  requireAdminOrManager,
} from "../middleware/authMiddleware.js";
import {
  createReview,
  getProductReviews,
  getAllReviews,
  editReview,
  deleteReview,
} from "../controllers/reviewController.js";

router.post("/", verifyToken, createReview);

router.get("/:id", getProductReviews);

router.get("/", verifyToken, getAllReviews);

router.put("/:id", verifyToken, requireAdminOrManager, editReview);

router.delete("/:id", verifyToken, requireAdminOrManager, deleteReview);

export default router;
