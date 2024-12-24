// Shadow Of Leaf was Here

const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/multerMiddleware");

const {
  verifyToken,
  requireAdminOrManager,
} = require("../middleware/authMiddleware");
const {
  createData,
  searchingItems,
  RetrievingItems,
  categorySub,
  RetrieveById,
  UpdateProductById,
  DeleteProductById,
  updateReview,
} = require("../controllers/productController");
router.post(
  "/",
  verifyToken,
  requireAdminOrManager,
  upload.array("product_images", 5),
  createData
);
router.get("/", RetrievingItems);
router.get("/replace", categorySub);
router.get("/search", searchingItems);
router.get("/:id", RetrieveById);
router.put(
  "/:id",
  verifyToken,
  requireAdminOrManager,
  upload.array("product_images", 5),
  UpdateProductById
);
router.put("/:reviewId", verifyToken, requireAdminOrManager, updateReview);
router.delete("/:id", verifyToken, requireAdminOrManager, DeleteProductById);

module.exports = router;
