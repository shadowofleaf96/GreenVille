import Notification from "../models/Notification.js";
import { Customer } from "../models/Customer.js";
import transporter from "../middleware/mailMiddleware.js";
import admin from "../config/firebase.js";

const decodeAndStripHTML = (html) => {
  if (!html) return "";

  // 1. Strip HTML tags
  const stripped = html.replace(/<[^>]*>?/gm, "");

  // 2. Decode basic HTML entities
  const entities = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&apos;": "'",
    "&#39;": "'",
    "&nbsp;": " ",
  };

  return stripped.replace(/&[a-z0-9#]+;/gi, (match) => {
    return entities[match.toLowerCase()] || match;
  });
};

export const sendNotification = async (req, res) => {
  const { subject, body, sendType } = req.body;

  const customers = await Customer.find({}, "email");
  const recipients = customers.map((customer) => customer.email);

  // Use the lightweight helper instead of jsdom
  const decodedBody = decodeAndStripHTML(body);

  if (sendType === "email" || sendType === "both") {
    const emailPromises = recipients.map((recipient) => {
      return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: recipient,
        subject,
        html: `<div>${decodedBody}</div>`,
        headers: {
          "Content-Type": "text/html; charset=UTF-8",
        },
      });
    });

    await Promise.all(emailPromises);
  }

  if (sendType === "android" || sendType === "both") {
    const fcmMessage = {
      notification: {
        title: subject,
        body: "Check out our newest offers",
        image: "https://greenville-frontend.vercel.app/assets/logo-android.png",
      },
      topic: "allAndroidDevices",
    };

    try {
      await admin.messaging().send(fcmMessage);
    } catch (fcmError) {
      console.error("Error sending FCM message:", fcmError);
    }
  }

  const newNotification = new Notification({
    subject,
    body,
    sendType,
    recipients,
    dateSent: new Date(),
  });

  await newNotification.save();
  res
    .status(200)
    .json({ message: "Notification sent and saved!", data: newNotification });
};

export const getAllNotifications = async (req, res) => {
  const notifications = await Notification.find().lean();
  res.status(200).json({ data: notifications });
};

export const deleteNotification = async (req, res) => {
  const { id } = req.params;
  const deletedNotification = await Notification.findByIdAndDelete(id);

  if (!deletedNotification) {
    return res.status(404).json({ error: "Notification not found" });
  }

  res.status(200).json({ message: "Notification deleted successfully" });
};
