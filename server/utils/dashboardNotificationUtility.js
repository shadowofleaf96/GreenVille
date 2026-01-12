const DashboardNotification = require("../models/DashboardNotification");

/**
 * Creates a notification for the dashboard (admin/vendor panel).
 * @param {Object} params
 * @param {string} params.type - enum: ["ORDER_CREATED", "REVIEW_ADDED", "VENDOR_APPLIED", "CONTACT_MESSAGE", "PAYMENT_RECEIVED"]
 * @param {string} params.title - Short title of the notification
 * @param {string} params.message - Detailed message
 * @param {Object} [params.metadata] - Optional object containing related IDs (e.g., { order_id: "..." })
 * @param {string} [params.recipient_role="admin"] - "admin" or "vendor"
 * @param {string} [params.vendor_id=null] - Specify if the notification is for a specific vendor
 */
const createDashboardNotification = async ({
  type,
  title,
  message,
  metadata = {},
  recipient_role = "admin",
  vendor_id = null,
}) => {
  try {
    const notification = new DashboardNotification({
      type,
      title,
      message,
      metadata,
      recipient_role,
      vendor_id,
    });
    await notification.save();
    console.log(`[DashboardNotification] Created: ${type} - ${title}`);
    return notification;
  } catch (error) {
    console.error("Error creating dashboard notification:", error);
  }
};

module.exports = { createDashboardNotification };
