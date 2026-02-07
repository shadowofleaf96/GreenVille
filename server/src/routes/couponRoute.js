import express from "express";
const router = express.Router();
import {
  verifyToken,
  requireAdminOrManager,
} from "../middleware/authMiddleware.js";
import {
  createCoupon,
  applyCoupon,
  getAllCoupons,
  editCoupon,
  deleteCoupon,
  revokeCouponUsage,
} from "../controllers/couponController.js";

router.post("/create", verifyToken, requireAdminOrManager, createCoupon);

router.post("/apply", verifyToken, applyCoupon);

router.get("/", verifyToken, requireAdminOrManager, getAllCoupons);

router.put("/:id", verifyToken, requireAdminOrManager, editCoupon);

router.delete("/:id", verifyToken, requireAdminOrManager, deleteCoupon);

router.delete(
  "/revoke-usage/:id/:userId",
  verifyToken,
  requireAdminOrManager,
  revokeCouponUsage,
);

export default router;
