const express = require("express");
const route = express.Router();

const {
  verifyToken,
  requireAdminOrManager,
} = require("../middleware/authMiddleware");
const { upload } = require("../middleware/multerMiddleware");

const {
  createSubcategory,
  getAllSubcategories,
  getSubcategoryById,
  updateSubcategoryById,
  deleteSubcategoryById,
} = require("../controllers/subcategoryController");

route.post(
  "/",
  verifyToken,
  requireAdminOrManager,
  upload.single("subcategory_image"),
  createSubcategory,
);
route.get("/", getAllSubcategories);
route.get("/:id", getSubcategoryById);
route.put(
  "/:id",
  verifyToken,
  requireAdminOrManager,
  upload.single("subcategory_image"),
  updateSubcategoryById,
);
route.delete("/:id", deleteSubcategoryById);

module.exports = route;
