const Notification = require("../models/Notification");
const { Customer } = require("../models/Customer");
const transporter = require("../middleware/mailMiddleware");
const admin = require("../config/firebase");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

class DOMParser {
  parseFromString(s, contentType = "text/html") {
    return new JSDOM(s, { contentType }).window.document;
  }
}

const decodeHTML = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.documentElement.textContent || doc.body.textContent;
};

const sendNotification = async (req, res) => {
  const { subject, body, sendType } = req.body;

  try {
    const customers = await Customer.find({}, "email");
    const recipients = customers.map((customer) => customer.email);

    const decodedBody = decodeHTML(body);

    if (sendType === "email" || sendType === "both") {
      const emailPromises = recipients.map((recipient) => {
        return transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: recipient,
          subject,
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
          body: subject,
          image:
            "https://greenville-frontend.vercel.app/assets/logo-android.png",
        },
        topic: "allAndroidDevices",
      };

      try {
        const response = await admin.messaging().send(fcmMessage);
        console.log("FCM response:", response);
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
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while sending the notification" });
    console.error(error);
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json({ data: notifications });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while retrieving notifications" });
    console.log(error);
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNotification = await Notification.findByIdAndDelete(id);

    if (!deletedNotification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the notification" });
    console.log(error);
  }
};

module.exports = {
  sendNotification,
  getAllNotifications,
  deleteNotification,
};
