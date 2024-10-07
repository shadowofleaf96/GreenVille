const express = require("express");
const router = express.Router();

const {
  CreateOrders,
  RetrievingOrders,
  getUserOrders,
  searchingOrders,
  UpdateOrdersById,
  DeleteOrdersById
} = require("../controllers/ordersController");
const {
  verifyToken,
  requireAdminOrManager,
} = require("../middleware/authMiddleware");

router.post("/", CreateOrders);
router.get("/", RetrievingOrders);
router.get("/:userId", getUserOrders);
router.get("/:id", verifyToken, requireAdminOrManager, searchingOrders);
router.put("/:id", verifyToken, requireAdminOrManager, UpdateOrdersById);
router.delete("/:id", verifyToken, requireAdminOrManager, DeleteOrdersById);

module.exports = router;
