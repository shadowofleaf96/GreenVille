import { Coupon } from "../models/Coupon.js";
import { withTransaction } from "../utils/withTransaction.js";

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

  try {
    const coupon = await withTransaction(async (session) => {
      const c = await Coupon.findOne({ code }).session(session).exec();

      if (!c || !c.isValid(userId)) {
        throw new Error("Invalid or expired coupon");
      }

      c.usedBy.push(userId);
      await c.save({ session });
      return c;
    });

    res.status(200).json({ success: true, discount: coupon.discount });
  } catch (error) {
    if (error.message === "Invalid or expired coupon") {
      return res.status(400).json({ error: error.message });
    }
    console.error("Transaction Error during coupon apply:", error);
    res.status(500).json({ error: "Failed to apply coupon" });
  }
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
