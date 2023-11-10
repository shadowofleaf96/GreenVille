const express = require("express");
const route = express.Router();

const {
  verifyToken,
  requireAdminOrManager,
} = require("../middleware/authMiddleware");

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
  createSubcategory
);
route.get("/", getAllSubcategories);
route.get("/:id", getSubcategoryById);
route.put(
  "/:id",
  verifyToken,
  requireAdminOrManager,
  updateSubcategoryById
);
route.delete("/:id", deleteSubcategoryById);

module.exports = route;
