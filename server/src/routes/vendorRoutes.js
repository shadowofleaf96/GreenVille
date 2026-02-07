import express from "express";
const router = express.Router();
import {
  registerVendor,
  getVendorProfile,
  updateVendorProfile,
  updateVendorStatus,
  getAllVendors,
  deleteVendor,
} from "../controllers/vendorController.js";
import { upload } from "../middleware/multerMiddleware.js";
import {
  verifyToken,
  requireAdmin,
  requireAdminOrManager,
} from "../middleware/authMiddleware.js";

// Public/User routes
router.post("/register", upload.single("store_logo"), registerVendor);
router.get("/profile/:userId", getVendorProfile);
router.put(
  "/profile/:userId",
  verifyToken,
  upload.single("store_logo"),
  updateVendorProfile,
);

// Admin routes
router.patch("/status/:id", verifyToken, requireAdmin, updateVendorStatus);
router.get("/", verifyToken, requireAdminOrManager, getAllVendors);
router.delete("/:id", verifyToken, requireAdmin, deleteVendor);

export default router;
