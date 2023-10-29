const express = require("express");
const router = express.Router();

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
} = require("../controllers/productController");
router.post("/", verifyToken, requireAdminOrManager, createData);
router.get("/", RetrievingItems);
router.get("/replace", categorySub);
router.get("/search", searchingItems);
router.get("/:id", RetrieveById);
router.put(
  "/:id",
  verifyToken,
  requireAdminOrManager,
  UpdateProductById
);
router.delete(
  "/:id",
  verifyToken,
  requireAdminOrManager,
  DeleteProductById
);

module.exports = router;
