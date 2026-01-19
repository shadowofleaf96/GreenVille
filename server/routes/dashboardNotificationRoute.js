import express from "express";
const router = express.Router();
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/dashboardNotificationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

router.get("/", verifyToken, getNotifications);
router.patch("/mark-all-read", verifyToken, markAllAsRead);
router.patch("/:id/read", verifyToken, markAsRead);
router.delete("/:id", verifyToken, deleteNotification);

export default router;
