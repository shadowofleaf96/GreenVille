const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/dashboardNotificationController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", verifyToken, getNotifications);
router.patch("/mark-all-read", verifyToken, markAllAsRead);
router.patch("/:id/read", verifyToken, markAsRead);
router.delete("/:id", verifyToken, deleteNotification);

module.exports = router;
