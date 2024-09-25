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
  cart_total_price: Joi.number().min(0).required(),
  status: Joi.string()
    .valid("open", "processing", "shipped", "delivered", "canceled")
    .default("open"),
  shipping_address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    postal_code: Joi.string().required(),
    country: Joi.string().required(),
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
      enum: ["open", "processing", "shipped", "delivered", "canceled"],
      default: "open",
    },
    shipping_address: {
      street: String,
      city: String,
      postal_code: String,
      country: String,
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
