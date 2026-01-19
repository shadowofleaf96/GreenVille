import express from "express";
const router = express.Router();
import { upload } from "../middleware/multerMiddleware.js";

import {
  verifyToken,
  requireAdmin,
  requireAdminOrManager,
} from "../middleware/authMiddleware.js";

import {
  createUser,
  getAllUsers,
  getUserDetails,
  searchUser,
  updateUser,
  deleteUser,
  loginUser,
  getAdminProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";

router.post("/login", loginUser);
router.post(
  "/",
  verifyToken,
  requireAdmin,
  upload.single("user_image"),
  createUser,
);
router.put(
  "/:id",
  verifyToken,
  requireAdmin,
  upload.single("user_image"),
  updateUser,
);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.delete("/:id", verifyToken, requireAdmin, deleteUser);
router.get("/", verifyToken, requireAdminOrManager, getAllUsers);
router.get("/profile", verifyToken, getAdminProfile);
router.get("/search", verifyToken, requireAdminOrManager, searchUser);
router.get("/:id", verifyToken, requireAdminOrManager, getUserDetails);

export default router;
