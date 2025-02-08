const express = require("express");
const {
  sendNotification,
  getAllNotifications,
  deleteNotification,
} = require("../controllers/notificationController");

const router = express.Router();

router.post("/send-notification", sendNotification);
router.get("/get-notifications", getAllNotifications);
router.delete("/delete-notification/:id", deleteNotification);

module.exports = router;
