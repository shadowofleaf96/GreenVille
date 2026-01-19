import express from "express";
const router = express.Router();

import {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/ordersController.js";
import {
  verifyToken,
  requireAdminOrManager,
} from "../middleware/authMiddleware.js";

router.post("/", verifyToken, createOrder);
router.get("/", verifyToken, requireAdminOrManager, getAllOrders);
router.get("/:userId", verifyToken, getUserOrders);
router.get("/:id", verifyToken, requireAdminOrManager, getOrderById);
router.put("/:id", verifyToken, requireAdminOrManager, updateOrder);
router.delete("/:id", verifyToken, requireAdminOrManager, deleteOrder);

export default router;
