const express = require("express");
const mongoose = require("mongoose");

const ordersSchema = mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
    },
    order_items: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Replace "Product" with the actual model name for your products
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    order_date: {
      type: Number,
      default: Date.now,
    },
    cart_total_price: {
      type: Number,
    },
    status: {
      type: String,
      default: "open",
    },
  },
  {
    collection: "Orders",
    versionKey: false,
  }
);

const Order = mongoose.model("Order", ordersSchema);

if (Order) {
  console.log("Order Schema created");
} else {
  console.log("error");
}

module.exports = Order;
