const express = require("express");
const route = express.Router();
const { upload } = require("../middleware/multerMiddleware");

const {
  verifyToken,
  requireAdminOrManager,
} = require("../middleware/authMiddleware");

const {
  login,
  createCustomer,
  getCustomerById,
  googleLogin,
  getCustomerProfile,
  getAllCustomers,
  validateCustomer,
  updateCustomer,
  completeRegistration,
  deleteCustomer,
  forgotPassword,
  resetPassword,
} = require("../controllers/customerController");

route.post("/login", login);
route.post("/", upload.single("customer_image"), createCustomer);
route.post("/google-login", googleLogin);
route.post("/complete-registration", upload.single("customer_image"), completeRegistration);
route.get("/profile", verifyToken, getCustomerProfile);
route.get("/", verifyToken, requireAdminOrManager, getAllCustomers);
route.get("/:id", verifyToken, requireAdminOrManager, getCustomerById);
route.get("/validate/:id/:token", validateCustomer);
route.put("/:id", upload.single("customer_image"), updateCustomer);
route.delete("/:id", deleteCustomer);
route.post("/forgot-password", forgotPassword);
route.post("/reset-password/:token", resetPassword);

module.exports = route;
