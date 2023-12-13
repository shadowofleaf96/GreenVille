const express = require("express");
const router = express.Router();

const {
  CreateOrders,
  RetrievingOrders,
  searchingOrders,
  UpdateOrdersById,
} = require("../controllers/ordersController");
const {
  verifyToken,
  requireAdminOrManager,
} = require("../middleware/authMiddleware");

router.post("/", CreateOrders);
router.get("/", RetrievingOrders);
router.get("/:id", verifyToken, requireAdminOrManager, searchingOrders);
router.put(
  "/:id",
  verifyToken,
  requireAdminOrManager,
  UpdateOrdersById
);

module.exports = router;
