import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";
import Stripe from "stripe";
import axios from "axios";
import { Customer } from "../models/Customer.js";
import { sendPaymentConfirmationEmail } from "../utils/emailUtility.js";
import { createDashboardNotification } from "../utils/dashboardNotificationUtility.js";
import { Product } from "../models/Product.js";

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

export const retrievePayments = async (req, res) => {
  const payments = await Payment.find()
    .populate({
      path: "order_id",
      populate: {
        path: "customer_id",
        select: "first_name last_name",
      },
    })
    .lean();

  const paymentsWithOrders = payments.map((payment) => {
    const order = payment.order_id || {};
    if (!payment.order_id) {
      return {
        ...payment,
        order: { customer: { first_name: "Unknown", last_name: "Unknown" } },
      };
    }

    const customer = order.customer_id || {};

    return {
      ...payment,
      order: {
        ...order,
        customer: {
          first_name: customer.first_name || "Unknown",
          last_name: customer.last_name || "Unknown",
        },
      },
    };
  });

  res.status(200).json({ data: paymentsWithOrders });
};

export const searchPayment = async (req, res) => {
  const { id } = req.params;
  const payment = await Payment.findById(id).lean();
  if (!payment) {
    return res.status(404).json({ error: "Payment not found" });
  }
  res.status(200).json(payment);
};

export const updatePayment = async (req, res) => {
  const { id } = req.params;
  const newData = req.body;

  const updatedPayment = await Payment.findByIdAndUpdate(
    id,
    { ...newData },
    { new: true },
  );

  if (!updatedPayment) {
    return res.status(404).json({ error: "Payment not found" });
  }

  res.status(200).json({
    status: 200,
    message: "Payment updated successfully",
    data: updatedPayment,
  });
};

export const removePayment = async (req, res) => {
  const { id } = req.params;
  const deletedPayment = await Payment.findByIdAndDelete(id);

  if (!deletedPayment) {
    return res.status(404).json({ error: "Payment not found" });
  }

  res.status(200).json({
    status: 200,
    message: "Payment deleted successfully",
  });
};

export const createStripePayment = async (req, res) => {
  const { amount, currency } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: currency,
  });

  res.status(200).json({
    clientSecret: paymentIntent.client_secret,
  });
};

export const savePaymentInfo = async (req, res) => {
  const {
    order_id,
    amount,
    paymentMethod,
    paymentStatus,
    currency,
    paymentCredentials,
  } = req.body;

  const order = await Order.findById({ _id: order_id });

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  const payment = new Payment({
    order_id,
    amount,
    paymentMethod,
    paymentStatus: paymentStatus,
    currency: currency || "USD",
    ...(paymentMethod === "credit_card" && { paymentCredentials }),
  });

  await payment.save();

  // Send payment confirmation email if successful
  if (paymentStatus === "succeeded" || paymentStatus === "paid") {
    const customer = await Customer.findById(order.customer_id);
    if (customer) {
      try {
        await sendPaymentConfirmationEmail(customer, order, payment);
      } catch (emailError) {
        console.error("Failed to send payment confirmation email:", emailError);
      }
    }

    // Dashboard Notifications
    try {
      // Notify Admin
      await createDashboardNotification({
        type: "PAYMENT_RECEIVED",
        title: "Payment Received",
        message: `Payment of ${payment.amount} ${
          payment.currency
        } received for order #${order._id.toString().slice(-5).toUpperCase()}`,
        metadata: { payment_id: payment._id, order_id: order._id },
        recipient_role: "admin",
      });

      // Notify Vendors - (Order might have items from multiple vendors)
      const productIds = order.order_items.map((item) => item.product_id);
      const products = await Product.find({
        _id: { $in: productIds },
      }).select("vendor");
      const vendorIds = [
        ...new Set(
          products.filter((p) => p && p.vendor).map((p) => p.vendor.toString()),
        ),
      ];

      for (const vId of vendorIds) {
        await createDashboardNotification({
          type: "PAYMENT_RECEIVED",
          title: "Payment Received for Order",
          message: `A payment has been received for order #${order._id
            .toString()
            .slice(-5)
            .toUpperCase()}.`,
          metadata: { order_id: order._id },
          recipient_role: "vendor",
          vendor_id: vId,
        });
      }
    } catch (notifError) {
      console.error("Failed to create dashboard notification:", notifError);
    }
  }

  res.status(200).json({
    message: "Payment created successfully",
    data: payment,
  });
};
