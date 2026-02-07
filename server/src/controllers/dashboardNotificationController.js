import DashboardNotification from "../models/DashboardNotification.js";

export const getNotifications = async (req, res) => {
  try {
    const { role, vendorId } = req.user;

    let query = {};
    if (role === "vendor") {
      query = { recipient_role: "vendor", vendor_id: vendorId };
    } else if (role === "admin" || role === "manager") {
      query = { recipient_role: "admin" };
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const notifications = await DashboardNotification.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.status(200).json({ data: notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await DashboardNotification.findByIdAndUpdate(
      id,
      { is_read: true },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res
      .status(200)
      .json({ message: "Notification marked as read", data: notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const { role, vendorId } = req.user;

    let query = { is_read: false };
    if (role === "vendor") {
      query.recipient_role = "vendor";
      query.vendor_id = vendorId;
    } else {
      query.recipient_role = "admin";
    }

    await DashboardNotification.updateMany(query, { is_read: true });

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await DashboardNotification.findByIdAndDelete(id);
    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
