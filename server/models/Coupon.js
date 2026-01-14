const { Schema, model, Types } = require("mongoose");
const Joi = require("joi");
const mongoose = require("mongoose");

const couponJoiSchema = Joi.object({
  _id: Joi.any().strip(),
  code: Joi.string()
    .required()
    .min(3)
    .max(30)
    .pattern(/^[A-Z0-9]+$/)
    .messages({
      "string.pattern.base": "Coupon code must be alphanumeric and uppercase",
      "string.min": "Coupon code must be at least 3 characters long",
      "string.max": "Coupon code must be less than 30 characters long",
    }),
  discount: Joi.number().required().min(0).max(100).messages({
    "number.min": "Discount must be at least 0",
    "number.max": "Discount must not exceed 100",
  }),
  expiresAt: Joi.date().required().greater("now").messages({
    "date.greater": "Expiration date must be in the future",
  }),
  usageLimit: Joi.number().integer().min(1).optional(),
  status: Joi.string().valid("active", "inactive").optional(),
  usedBy: Joi.array().items(Joi.any().strip()).optional(),
});

const couponMongooseSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      default: 0,
    },
    usedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customers",
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { collection: "Coupon", versionKey: false },
);

couponMongooseSchema.pre("save", async function (next) {
  try {
    await couponJoiSchema.validateAsync(this.toObject());
    next();
  } catch (error) {
    next(error);
  }
});

couponMongooseSchema.methods.isValid = function (userId) {
  const isExpired = this.expiresAt < new Date();
  const isUsedByUser = this.usedBy.includes(userId);
  const isUsageLimitExceeded = this.usedBy.length >= this.usageLimit;

  return !isExpired && !isUsedByUser && !isUsageLimitExceeded;
};

const Coupon = model("Coupon", couponMongooseSchema);

if (Coupon) {
  console.log("Coupon Schema created");
} else {
  console.log("error");
}

module.exports = {
  Coupon,
};
