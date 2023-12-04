const Joi = require("joi");
const mongoose = require("mongoose");

// Define Joi schema for payment data validation
const paymentJoiSchema = Joi.object({
  orderId: Joi.string().required(),
  amount: Joi.number().required(),
  paymentDate: Joi.date(),
  // Add more fields as needed
});

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    // Add more fields as needed
  },
  { timestamps: true,
    collection: "Payments",
    versionKey: false,
  }
);

// Add a pre-save hook to validate and sanitize data using Joi
paymentSchema.pre("save", async function (next) {
  try {
    // Validate the data against the Joi schema
    const validatedData = await paymentJoiSchema.validateAsync(this.toObject());

    // Update the schema fields with validated data
    this.orderId = validatedData.orderId;
    this.amount = validatedData.amount;
    this.paymentDate = validatedData.paymentDate;

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

module.exports = {
  Payment,
};
