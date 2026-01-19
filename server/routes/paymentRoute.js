import express from "express";
const router = express.Router();

import {
  createStripePayment,
  savePaymentInfo,
  retrievePayments,
  searchPayment,
  updatePayment,
  removePayment,
} from "../controllers/paymentController.js";
import {
  verifyToken,
  requireAdminOrManager,
} from "../middleware/authMiddleware.js";

router.post("/create-stripe-payment", verifyToken, createStripePayment);
router.post("/save-payment-info", verifyToken, savePaymentInfo);
router.put("/:id", verifyToken, requireAdminOrManager, updatePayment);
router.delete("/:id", verifyToken, requireAdminOrManager, removePayment);
router.get("/", verifyToken, requireAdminOrManager, retrievePayments);
router.get("/:id", verifyToken, requireAdminOrManager, searchPayment);

export default router;
