const express = require("express");
const router = express.Router();
const passport = require("passport");

router.use(passport.session());
const {
  isAuthenticated,
  requireAdmin,
  requireAdminOrManager
} = require("../middleware/authmiddleware");

const {
  createUser,
  getAllUsers,
  getUserDetails,
  searchUser,
  updateUser,
  deleteUser,
  loginUser,
  refreshTokenMiddleware,
  logOut,
} = require("../controllers/userController");

router.post("/v1/users/login", loginUser);
router.post(
  "/v1/users",
  passport.authenticate("jwt", { session: false }),
  isAuthenticated,
  requireAdmin,
  createUser
);
router.put(
  "/v1/users/:id",
  passport.authenticate("jwt", { session: false }),
  isAuthenticated,
  requireAdmin,
  updateUser
);
router.delete(
  "/v1/users/:id",
  passport.authenticate("jwt", { session: false }),
  isAuthenticated,
  requireAdmin,
  deleteUser
);
router.get(
  "/v1/users", passport.authenticate("jwt", { session: false }),
  refreshTokenMiddleware,
  isAuthenticated,
  requireAdminOrManager,
  getAllUsers
);
router.get(
  "/v1/users/search",
  passport.authenticate("jwt", { session: false }),
  isAuthenticated,
  requireAdminOrManager,
  searchUser
);
router.get(
  "/v1/users/:id",
  passport.authenticate("jwt", { session: false }),
  isAuthenticated,
  requireAdminOrManager,
  getUserDetails
);
router.post(
  "/v1/users/logout",
  passport.authenticate("jwt", { session: false }),
  isAuthenticated,
  requireAdminOrManager,
  logOut
);

module.exports = router;
