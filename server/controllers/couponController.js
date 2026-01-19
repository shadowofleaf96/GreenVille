import { Coupon } from "../models/Coupon.js";

export const createCoupon = async (req, res) => {
  const { code, discount, expiresAt, usageLimit, status } = req.body;

  const existingCoupon = await Coupon.findOne({ code });
  if (existingCoupon) {
    return res.status(400).json({ error: "Coupon code already exists" });
  }

  const coupon = new Coupon({
    code,
    discount,
    expiresAt,
    usageLimit,
    status,
  });
  await coupon.save();
  res
    .status(201)
    .json({ data: coupon, message: "Coupon created successfully" });
};

export const applyCoupon = async (req, res) => {
  const { code, userId } = req.body;

  const coupon = await Coupon.findOne({ code }).exec();

  if (!coupon || !coupon.isValid(userId)) {
    return res.status(400).json({ error: "Invalid or expired coupon" });
  }

  coupon.usedBy.push(userId);
  await coupon.save();

  res.status(200).json({ success: true, discount: coupon.discount });
};

export const getAllCoupons = async (req, res) => {
  const coupons = await Coupon.find().populate("usedBy", "name email").lean();
  res.status(200).json({ data: coupons });
};

export const editCoupon = async (req, res) => {
  const { id } = req.params;
  const { code, discount, expiresAt, usageLimit, status } = req.body;

  const updatedCoupon = await Coupon.findByIdAndUpdate(
    id,
    { code, discount, expiresAt, usageLimit, status },
    { new: true, runValidators: true },
  );

  if (!updatedCoupon)
    return res.status(404).json({ error: "Coupon not found" });

  res
    .status(200)
    .json({ data: updatedCoupon, message: "Coupon updated successfully" });
};

export const deleteCoupon = async (req, res) => {
  const { id } = req.params;

  const deletedCoupon = await Coupon.findByIdAndDelete(id);

  if (!deletedCoupon)
    return res.status(404).json({ error: "Coupon not found" });

  res.status(200).json({
    success: true,
    message: "Coupon deleted successfully",
  });
};

export const revokeCouponUsage = async (req, res) => {
  const { id, userId } = req.params;

  const coupon = await Coupon.findById(id);
  if (!coupon) return res.status(404).json({ error: "Coupon not found" });

  coupon.usedBy = coupon.usedBy.filter((u) => u.toString() !== userId);
  await coupon.save();

  res.status(200).json({
    success: true,
    message: "Coupon usage revoked successfully",
  });
};
