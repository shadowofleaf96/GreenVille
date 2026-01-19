import express from "express";
const router = express.Router();

import {
  verifyToken,
  requireAdminOrManager,
} from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multerMiddleware.js";

import {
  createCategory,
  getAllCategories,
  searchCategory,
  getCategoryDetails,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

router.post(
  "/",
  verifyToken,
  requireAdminOrManager,
  upload.single("category_image"),
  createCategory,
);
router.put(
  "/:id",
  verifyToken,
  requireAdminOrManager,
  upload.single("category_image"),
  updateCategory,
);
router.delete("/:id", verifyToken, requireAdminOrManager, deleteCategory);
router.get("/", getAllCategories);
router.get("/search", searchCategory);
router.get("/:id", getCategoryDetails);

export default router;
