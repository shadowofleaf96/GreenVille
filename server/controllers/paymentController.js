const Payment = require("../models/Payment");
const Order = require("../models/Order");
require("dotenv").config({ path: "../.env" });
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const axios = require("axios");

const retrievePayments = async (req, res) => {
  try {
    const payments = await Payment.find();

    const paymentsWithOrders = await Promise.all(payments.map(async (payment) => {
      const order = await Order.findById(payment.order_id).populate('customer_id', 'first_name last_name');
      
      return {
        ...payment._doc, 
        order: {
          ...order._doc, 
          customer: {
            first_name: order.customer_id.first_name,
            last_name: order.customer_id.last_name,
          }
        }
      };
    }));

    res.status(200).json({ data: paymentsWithOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const searchPayment = async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.status(200).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updatePayment = async (req, res) => {
  const { id } = req.params;
  const newData = req.body;

  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      id,
      { ...newData },
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.status(200).json({
      status: 200,
      message: "Payment updated successfully",
      data: updatedPayment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const removePayment = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPayment = await Payment.findByIdAndDelete(id);

    if (!deletedPayment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.status(200).json({
      status: 200,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createStripePayment = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: currency,
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Payment failed" });
  }
};

const savePaymentInfo = async (req, res) => {
  try {
    const { order_id, amount, paymentMethod, paymentStatus, currency, paymentCredentials } = req.body;

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
      ...(paymentMethod === "credit_card" && { paymentCredentials })
    });

    await payment.save();

    res.status(200).json({
      message: "Payment created successfully",
      data: payment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  retrievePayments,
  searchPayment,
  updatePayment,
  removePayment,
  createStripePayment,
  savePaymentInfo,
};
