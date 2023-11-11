const express = require("express");
const route = express.Router();
const { upload } = require('../middleware/multerMiddleware');

const {
  verifyToken,
  requireAdminOrManager,
} = require("../middleware/authMiddleware");

const {
  login,
  createCustomer,
  getCustomerById,
  getCustomerProfile,
  getAllCustomers,
  validateCustomer,
  updateCustomer,
  deleteCustomer,
  logout,
} = require("../controllers/customerController");

route.post("/login", login);
route.post("/",   upload.single('customer_image'),
createCustomer);
route.get("/profile", getCustomerProfile);
route.get(
  "/",
  verifyToken,
  requireAdminOrManager,
  getAllCustomers
);
route.get(
  "/:id",
  verifyToken,
  requireAdminOrManager,
  getCustomerById
);
route.put("/validate/:id", validateCustomer);
route.put("/:id", updateCustomer);
route.delete("/delete/:id", deleteCustomer);
route.post("/logout", logout);

module.exports = route;
