const express = require("express");
const router = express.Router();
const { verifyToken, requireAdminOrManager } = require("../middleware/authMiddleware");
const couponController = require("../controllers/couponController");

router.post("/create", verifyToken, requireAdminOrManager, couponController.createCoupon);

router.post("/apply", verifyToken, couponController.applyCoupon);

router.get("/", verifyToken, requireAdminOrManager, couponController.getAllCoupons);

router.put("/:id", verifyToken, requireAdminOrManager, couponController.editCoupon);

router.delete("/:id", verifyToken, requireAdminOrManager, couponController.deleteCoupon);

module.exports = router;
