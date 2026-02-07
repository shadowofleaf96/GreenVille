import express from "express";
const router = express.Router();
import { upload } from "../middleware/multerMiddleware.js";

import {
  verifyToken,
  optionalVerifyToken,
  requireAdminOrManager,
} from "../middleware/authMiddleware.js";
import {
  createProduct,
  searchProducts,
  getAllProducts,
  getProductsWithDetails,
  getProductById,
  updateProduct,
  deleteProduct,
  updateReview,
  getVendorProducts,
} from "../controllers/productController.js";

router.post(
  "/",
  verifyToken,
  requireAdminOrManager,
  upload.array("product_images", 5),
  createProduct,
);
router.get("/", optionalVerifyToken, getAllProducts);
router.get("/vendor", verifyToken, requireAdminOrManager, getVendorProducts);
router.get("/replace", getProductsWithDetails);
router.get("/search", searchProducts);
router.get("/:id", optionalVerifyToken, getProductById);
router.put(
  "/:id",
  verifyToken,
  requireAdminOrManager,
  upload.array("product_images", 5),
  updateProduct,
);
router.put("/:reviewId", verifyToken, requireAdminOrManager, updateReview);
router.delete("/:id", verifyToken, requireAdminOrManager, deleteProduct);

export default router;
