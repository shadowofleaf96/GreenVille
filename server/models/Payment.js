const Joi = require("joi");
const mongoose = require("mongoose");

const paymentJoiSchema = Joi.object({
  _id: Joi.any().optional().strip(),
  order_id: Joi.any().required(),
  amount: Joi.number().positive().required(),
  paymentMethod: Joi.string().valid("credit_card", "paypal", "cod").required(),
  paymentStatus: Joi.string()
    .valid("pending", "completed", "failed", "refunded")
    .default("pending"),
  currency: Joi.string().default("USD"),
}).options({ stripUnknown: true });

const paymentSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount must be a positive value"],
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "paypal", "cod"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    currency: {
      type: String,
      default: "USD",
    },
  },
  {
    timestamps: true,
    collection: "Payments",
    versionKey: false,
  }
);

paymentSchema.pre("save", async function (next) {
  try {
    const validatedData = await paymentJoiSchema.validateAsync(this.toObject());

    this.order_id = validatedData.order_id;
    this.amount = validatedData.amount;
    this.paymentMethod = validatedData.paymentMethod;
    this.paymentStatus = validatedData.paymentStatus;
    this.currency = validatedData.currency || this.currency;

    next();
  } catch (error) {
    next(error);
  }
});

const Payment = mongoose.model("Payment", paymentSchema);

if (Payment) {
  console.log("Payment Schema created");
} else {
  console.log("Error creating Payment Schema");
}

module.exports = Payment;
