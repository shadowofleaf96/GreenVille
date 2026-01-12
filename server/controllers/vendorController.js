const { Vendor, vendorJoiSchema } = require("../models/Vendor");
const { User } = require("../models/User");
const { Customer } = require("../models/Customer");
const { SiteSettings } = require("../models/SiteSettings");
const transporter = require("../middleware/mailMiddleware");
const {
  sendVendorApplicationEmail,
  generateEmailTemplate,
} = require("../utils/emailUtility");
const {
  createDashboardNotification,
} = require("../utils/dashboardNotificationUtility");

// Register a new vendor (Applied by a Customer)
const registerVendor = async (req, res) => {
  try {
    const {
      user_id,
      store_name,
      store_description,
      phone_number,
      vendor_type,
      rc_number,
      ice_number,
    } = req.body;

    const store_logo = req.file?.path || req.body.store_logo;

    // 1. Verify Customer exists (using user_id from frontend which is actually customer_id)
    const customer = await Customer.findById(user_id);
    if (!customer) {
      return res.status(404).json({ message: "Customer account not found" });
    }

    // 2. Check if already applied
    const existingVendor = await Vendor.findOne({ customer: user_id });
    if (existingVendor) {
      return res
        .status(400)
        .json({ message: "You have already applied to be a vendor" });
    }

    // 3. Check store name uniqueness
    const existingStore = await Vendor.findOne({ store_name });
    if (existingStore) {
      return res.status(400).json({ message: "Store name already taken" });
    }

    // 4. Create Vendor Application
    const newVendor = new Vendor({
      customer: user_id,
      store_name,
      store_description,
      store_logo,
      phone_number,
      vendor_type,
      rc_number,
      ice_number,
      status: "pending",
    });

    await newVendor.save();

    // Dashboard Notification for Admin
    try {
      await createDashboardNotification({
        type: "VENDOR_APPLIED",
        title: "New Vendor Application",
        message: `"${store_name}" has applied to become a vendor.`,
        metadata: { vendor_id: newVendor._id },
        recipient_role: "admin",
      });
    } catch (notifError) {
      console.error("Failed to create dashboard notification:", notifError);
    }

    // Send confirmation email to customer
    sendVendorApplicationEmail(customer, newVendor);

    res.status(201).json({
      message: "Vendor application submitted successfully",
      data: newVendor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVendorProfile = async (req, res) => {
  try {
    // Search by customer ID first, then User ID if not found (fallback)
    let vendor = await Vendor.findOne({ customer: req.params.userId }).lean();

    if (!vendor) {
      vendor = await Vendor.findOne({ user: req.params.userId }).lean();
    }

    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }
    res.status(200).json({ data: vendor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Template removed - using centralized utility

const updateVendorStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor application not found" });
    }

    vendor.status = status;
    await vendor.save();

    // SHADOW ACCOUNT LOGIC
    if (status === "approved") {
      // Fetch the Customer details
      const customer = await Customer.findById(vendor.customer);
      if (!customer) {
        return res
          .status(404)
          .json({ message: "Linked Customer account not found" });
      }

      // Check if a User account already exists for this email
      let user = await User.findOne({ email: customer.email });

      if (!user) {
        // Create Shadow User Account for Admin Panel Access
        user = new User({
          first_name: customer.first_name,
          last_name: customer.last_name,
          email: customer.email,
          user_name: `vendor_${vendor.store_name
            .replace(/\s+/g, "")
            .toLowerCase()
            .substring(0, 10)}_${Date.now()}`, // Generate unique username
          password: customer.password, // Copy hashed password (User model updated to accept pre-hashed)
          role: "vendor",
          status: true,
          user_image: customer.customer_image,
        });
        await user.save();
      } else {
        // If user exists, ensure they have vendor role?
        // For now, let's just make sure they can access dashboard if they were a regular user
        if (user.role === "user") {
          user.role = "vendor";
          await user.save();
        }
      }

      // Link the Shadow User to the Vendor Profile
      vendor.user = user._id;
      await vendor.save();

      // Send Approval Email
      const settings = await SiteSettings.findOne();
      const siteTitle = settings?.website_title?.en || "GreenVille";
      const primaryColor = settings?.theme?.primary_color || "#15803d";
      const adminPanelUrl = `${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/backoffice/login`;

      const title = `Congratulations ${customer.first_name}!`;
      const message = `Your application for <strong>${vendor.store_name}</strong> has been approved. You are now officially a vendor on ${siteTitle}! <br><br> To start adding your products and managing your store, please log in to our Vendor Panel using your customer credentials.`;

      const actionHtml = `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${adminPanelUrl}" style="background-color: ${primaryColor}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Open Vendor Panel</a>
        </div>
      `;

      const html = generateEmailTemplate(settings, title, message, actionHtml);

      const mailOptions = {
        to: customer.email,
        from: `"${siteTitle}" <${process.env.EMAIL_USER}>`,
        subject: `Welcome ${vendor.store_name}! Your Vendor Store is Approved`,
        html,
      };

      transporter.sendMail(mailOptions);
    }

    res.status(200).json({ message: `Vendor request ${status}`, data: vendor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const updateVendorProfile = async (req, res) => {
  try {
    const { store_name, store_description } = req.body;
    const store_logo = req.file ? req.file.path : undefined;

    const updateData = {};
    if (store_name) updateData.store_name = store_name;
    if (store_description) updateData.store_description = store_description;
    if (store_logo) updateData.store_logo = store_logo;

    const vendor = await Vendor.findOneAndUpdate(
      { $or: [{ customer: req.params.userId }, { user: req.params.userId }] },
      updateData,
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully", data: vendor });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Store name already taken" });
    }
    res.status(500).json({ message: error.message });
  }
};

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find()
      .populate("customer", "first_name last_name email customer_image") // Populate customer details
      .populate("user", "user_name email") // Populate shadow user details
      .lean();
    res.status(200).json({ data: vendors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Optionally delete the Shadow User?
    // Or just downgrade them to 'user' role
    if (vendor.user) {
      await User.findByIdAndUpdate(vendor.user, { role: "user" });
    }

    res.status(200).json({ message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerVendor,
  getVendorProfile,
  updateVendorStatus,
  updateVendorProfile,
  getAllVendors,
  deleteVendor,
};
