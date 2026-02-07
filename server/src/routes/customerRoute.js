import express from "express";
const route = express.Router();
import { upload } from "../middleware/multerMiddleware.js";

import {
  verifyToken,
  requireAdminOrManager,
} from "../middleware/authMiddleware.js";

import {
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
} from "../controllers/customerController.js";

route.post("/login", login);
route.post("/", upload.single("customer_image"), createCustomer);
route.post("/google-login", googleLogin);
route.post(
  "/complete-registration",
  upload.single("customer_image"),
  completeRegistration,
);
route.get("/profile", verifyToken, getCustomerProfile);
route.get("/", verifyToken, requireAdminOrManager, getAllCustomers);
route.get("/:id", verifyToken, requireAdminOrManager, getCustomerById);
route.get("/validate/:id/:token", validateCustomer);
route.put("/:id", upload.single("customer_image"), updateCustomer);
route.delete("/:id", deleteCustomer);
route.post("/forgot-password", forgotPassword);
route.post("/reset-password/:token", resetPassword);

export default route;
