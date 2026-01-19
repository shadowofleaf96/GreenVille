import express from "express";
import {
  sendNotification,
  getAllNotifications,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/send-notification", sendNotification);
router.get("/get-notifications", getAllNotifications);
router.delete("/:id", deleteNotification);

export default router;
