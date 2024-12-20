const Joi = require("joi");
const mongoose = require("mongoose");

const orderJoiSchema = Joi.object({
  _id: Joi.any().optional(),
  customer_id: Joi.any().required(),
  order_items: Joi.array()
    .items(
      Joi.object({
        _id: Joi.any().optional(),
        product_id: Joi.any().required(),
        quantity: Joi.number().min(1).required(),
        price: Joi.number().positive().required(),
      })
    )
    .required(),
  order_date: Joi.date().default(Date.now),
  is_review_allowed: Joi.boolean(),
  cart_total_price: Joi.number().min(0).required(),
  status: Joi.string().valid("open", "processing", "canceled").default("open"),
  shipping_address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    postal_code: Joi.string().required(),
    country: Joi.string().required(),
    phone_no: Joi.string().required(),
  }).required(),
  shipping_method: Joi.string().optional(),
  shipping_status: Joi.string()
    .valid("not_shipped", "shipped", "in_transit", "delivered")
    .default("not_shipped"),
  order_notes: Joi.string().optional(),
  payment: Joi.string().optional(),
}).options({ stripUnknown: true });

const ordersSchema = mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
      required: true,
      index: true,
    },
    order_items: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1."],
        },
        price: {
          type: Number,
          required: true,
        },
        reviewed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    order_date: {
      type: Date,
      default: Date.now,
    },
    cart_total_price: {
      type: Number,
      required: true,
      min: [0, "Total price cannot be negative."],
    },
    status: {
      type: String,
      enum: ["open", "processing", "canceled", "completed"],
      default: "open",
    },
    shipping_address: {
      street: String,
      city: String,
      postal_code: String,
      country: String,
      phone_no: String,
    },
    shipping_method: {
      type: String,
    },
    shipping_status: {
      type: String,
      enum: ["not_shipped", "shipped", "in_transit", "delivered"],
      default: "not_shipped",
    },
    order_notes: {
      type: String,
    },
    is_review_allowed: {
      type: Boolean,
      default: false,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: false,
    },
  },
  {
    collection: "Orders",
    versionKey: false,
    timestamps: true,
  }
);

const calculateReviewAllowed = (orderDate) => {
  const reviewAllowedDate = new Date(orderDate);
  reviewAllowedDate.setDate(reviewAllowedDate.getDate() + 7);
  return Date.now() >= reviewAllowedDate.getTime();
};

ordersSchema.pre("save", async function (next) {
  try {
    const validatedData = await orderJoiSchema.validateAsync(this.toObject());

    this.customer_id = validatedData.customer_id;
    this.order_items = validatedData.order_items;
    this.order_date = validatedData.order_date || this.order_date;
    this.cart_total_price = validatedData.cart_total_price;
    this.status = validatedData.status;
    this.shipping_address = validatedData.shipping_address;
    this.shipping_method =
      validatedData.shipping_method || this.shipping_method;
    this.shipping_status = validatedData.shipping_status;
    this.order_notes = validatedData.order_notes || this.order_notes;
    this.payment = validatedData.payment || this.payment;

    if (this.isModified("status") && this.status === "completed") {
      this.is_review_allowed = calculateReviewAllowed(this.order_date);
    }
    next();
  } catch (error) {
    next(error);
  }
});

ordersSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();

    if (update.status === "completed") {
      const order = await this.model.findOne(this.getQuery());
      update.is_review_allowed = calculateReviewAllowed(order.order_date);
      this.setUpdate(update);
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Order = mongoose.model("Order", ordersSchema);

if (Order) {
  console.log("Order Schema created");
} else {
  console.log("Error creating Order Schema");
}

module.exports = Order;
