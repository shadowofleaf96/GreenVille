const express = require("express");
const router = express.Router();
const { upload } = require('../middleware/multerMiddleware');

const {
  verifyToken,
  requireAdmin,
  requireAdminOrManager
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
} = require("../controllers/userController");

router.post("/login", loginUser);
router.post(
  "/",
  verifyToken,
  requireAdmin,
  upload.single('user_image'),
  createUser
);
router.put(
  "/:id",
  verifyToken,
  requireAdmin,
  updateUser
);
router.delete(
  "/:id",
  verifyToken,
  requireAdmin,
  deleteUser
);
router.get(
  "/",
  verifyToken,
  requireAdminOrManager,
  getAllUsers
);
router.get(
  "/search",
  verifyToken,
  requireAdminOrManager,
  searchUser
);
router.get(
  "/:id",
  verifyToken,
  requireAdminOrManager,
  getUserDetails
);
router.post(
  "/logout",
  verifyToken,
  requireAdminOrManager,
  logOut
);

module.exports = router;
