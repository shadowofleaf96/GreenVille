const express = require("express");
const router = express.Router();
const {
  isAuthenticated,
  requireAdminOrManager,
} = require("../middleware/authmiddleware");
const {
  createData,
  searchingItems,
  RetrievingItems,
  categorySub,
  RetrieveById,
  UpdateProductById,
  DeleteProductById,
} = require("../controllers/productController");
router.post("/v1/products", isAuthenticated, requireAdminOrManager, createData);
router.get("/v1/products", RetrievingItems);
router.get("/v1/products/replace", categorySub);
router.get("/v1/products/search", searchingItems);
router.get("/v1/products/:id", RetrieveById);
router.put(
  "/v1/products/:id",
  isAuthenticated,
  requireAdminOrManager,
  UpdateProductById
);
router.delete(
  "/v1/product/:id",
  isAuthenticated,
  requireAdminOrManager,
  DeleteProductById
);

module.exports = router;
