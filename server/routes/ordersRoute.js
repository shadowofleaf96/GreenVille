const express = require("express");
const router = express.Router();
const {
  CreateOrders,
  RetrievingOrders,
  searchingOrders,
  UpdateOrdersById,
} = require("../controllers/ordersController");
const {
  isAuthenticated,
  requireAdminOrManager,
} = require("../middleware/authmiddleware");

router.post("/v1/orders", isAuthenticated, requireAdminOrManager, CreateOrders);
router.get("/v1/orders", RetrievingOrders);
router.get("/v1/orders/:id", searchingOrders);
router.put(
  "/v1/orders/:id",
  isAuthenticated,
  requireAdminOrManager,
  UpdateOrdersById
);

module.exports = router;
