const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/multerMiddleware");

const {
  verifyToken,
  requireAdmin,
  requireAdminOrManager,
} = require("../middleware/authMiddleware");

const {
  createUser,
  getAllUsers,
  getUserDetails,
  searchUser,
  updateUser,
  deleteUser,
  loginUser,
  logOut,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

router.post("/login", loginUser);
router.post(
  "/",
  verifyToken,
  requireAdmin,
  upload.single("user_image"),
  createUser
);
router.put(
  "/:id",
  verifyToken,
  requireAdmin,
  upload.single("user_image"),
  updateUser
);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.delete("/:id", verifyToken, requireAdmin, deleteUser);
router.get("/", verifyToken, requireAdminOrManager, getAllUsers);
router.get("/search", verifyToken, requireAdminOrManager, searchUser);
router.get("/:id", verifyToken, requireAdminOrManager, getUserDetails);
router.post("/logout", verifyToken, requireAdminOrManager, logOut);

module.exports = router;
