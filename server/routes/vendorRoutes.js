const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendorController");
const { upload } = require("../middleware/multerMiddleware");

// Public/User routes
router.post(
  "/register",
  upload.single("store_logo"),
  vendorController.registerVendor,
);
const {
  verifyToken,
  requireAdmin,
  requireAdminOrManager,
} = require("../middleware/authMiddleware");

// Public/User routes
router.post(
  "/register",
  upload.single("store_logo"),
  vendorController.registerVendor,
);
router.get("/profile/:userId", vendorController.getVendorProfile);
router.put(
  "/profile/:userId",
  verifyToken,
  upload.single("store_logo"),
  vendorController.updateVendorProfile,
);

// Admin routes
router.patch(
  "/status/:id",
  verifyToken,
  requireAdmin,
  vendorController.updateVendorStatus,
);
router.get(
  "/",
  verifyToken,
  requireAdminOrManager,
  vendorController.getAllVendors,
);
router.delete("/:id", verifyToken, requireAdmin, vendorController.deleteVendor);

module.exports = router;
