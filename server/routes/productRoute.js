// Shadow Of Leaf was Here

const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/multerMiddleware");

const {
  verifyToken,
  optionalVerifyToken,
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
  getVendorProducts,
} = require("../controllers/productController");
router.post(
  "/",
  verifyToken,
  requireAdminOrManager,
  upload.array("product_images", 5),
  createData,
);
router.get("/", optionalVerifyToken, RetrievingItems);
router.get("/vendor", verifyToken, requireAdminOrManager, getVendorProducts);
router.get("/replace", categorySub);
router.get("/search", searchingItems);
router.get("/:id", optionalVerifyToken, RetrieveById);
router.put(
  "/:id",
  verifyToken,
  requireAdminOrManager,
  upload.array("product_images", 5),
  UpdateProductById,
);
router.put("/:reviewId", verifyToken, requireAdminOrManager, updateReview);
router.delete("/:id", verifyToken, requireAdminOrManager, DeleteProductById);

module.exports = router;
