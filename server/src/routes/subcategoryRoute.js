import express from "express";
const router = express.Router();

import {
  verifyToken,
  requireAdminOrManager,
} from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multerMiddleware.js";

import {
  createSubcategory,
  getAllSubcategories,
  getSubcategoryById,
  updateSubcategoryById,
  deleteSubcategoryById,
} from "../controllers/subcategoryController.js";

router.post(
  "/",
  verifyToken,
  requireAdminOrManager,
  upload.single("subcategory_image"),
  createSubcategory,
);
router.get("/", getAllSubcategories);
router.get("/:id", getSubcategoryById);
router.put(
  "/:id",
  verifyToken,
  requireAdminOrManager,
  upload.single("subcategory_image"),
  updateSubcategoryById,
);
router.delete("/:id", deleteSubcategoryById);

export default router;
