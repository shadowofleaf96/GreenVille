const mongoose = require("mongoose");

const dashboardNotificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "ORDER_CREATED",
        "REVIEW_ADDED",
        "VENDOR_APPLIED",
        "CONTACT_MESSAGE",
        "PAYMENT_RECEIVED",
        "CUSTOMER_REGISTERED",
      ],
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    is_read: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: Object,
    },
    recipient_role: {
      type: String,
      enum: ["admin", "vendor"],
      default: "admin",
    },
    vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "DashboardNotifications",
    versionKey: false,
  },
);

module.exports = mongoose.model(
  "DashboardNotification",
  dashboardNotificationSchema,
);
