const express = require("express");
const router = express.Router();

const {
  CreateOrders,
  RetrievingOrders,
  getUserOrders,
  searchingOrders,
  UpdateOrdersById,
  DeleteOrdersById,
} = require("../controllers/ordersController");
const {
  verifyToken,
  requireAdminOrManager,
} = require("../middleware/authMiddleware");

router.post("/", verifyToken, CreateOrders);
router.get("/", verifyToken, requireAdminOrManager, RetrievingOrders);
router.get("/:userId", verifyToken, getUserOrders);
router.get("/:id", verifyToken, requireAdminOrManager, searchingOrders);
router.put("/:id", verifyToken, requireAdminOrManager, UpdateOrdersById);
router.delete("/:id", verifyToken, requireAdminOrManager, DeleteOrdersById);

module.exports = router;
