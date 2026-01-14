const express = require("express");
const router = express.Router();

const {
  verifyToken,
  requireAdminOrManager,
} = require("../middleware/authMiddleware");
const { upload } = require("../middleware/multerMiddleware");

const {
  createCategory,
  getAllCategories,
  searchCategory,
  getCategoryDetails,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

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

module.exports = router;
