const express = require("express");
const router = express.Router();

const {
  createPayPalPayment,
  createStripePayment,
  savePaymentInfo,
  retrievePayments,
  searchPayment,
  updatePayment,
  removePayment,
} = require("../controllers/paymentController");
const {
  verifyToken,
  requireAdminOrManager,
} = require("../middleware/authMiddleware");

router.post("/create-stripe-payment", createStripePayment);
router.post("/save-payment-info", savePaymentInfo);
router.put("/:id", updatePayment);
router.delete("/:id", removePayment);
router.get(
  "/",
  // verifyToken,
  // requireAdminOrManager,
  retrievePayments
);
router.get(
  "/:id",
  // verifyToken,
  // requireAdminOrManager,
  searchPayment
);

module.exports = router;
