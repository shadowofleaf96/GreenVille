const Payment = require("../models/Payment");
const Order = require("../models/Order");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const createPayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    // Fetch order details to ensure it exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in cents
      currency: "usd", // Adjust based on your currency
    });

    // Save payment details to your database
    const payment = new Payment({
      orderId,
      amount,
      paymentIntentId: paymentIntent.id,
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

const retrievePayments = async (req, res) => {
  try {
    const payments = await Payment.find();

    res.status(200).json({
      data: payments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const searchPayment = async (req, res) => {
  const id = req.params.id;
  try {
    const paymentById = await Payment.findById(id);

    if (!paymentById) {
      return res.status(404).json({ error: "Payment not found" });
    }

    return res.status(200).json(paymentById);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updatePayment = async (req, res) => {
  const id = req.params.id;
  const newData = req.body;

  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      id,
      {
        ...newData,
      },
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    return res.status(200).json({
      status: 200,
      message: "Payment updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const removePayment = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedPayment = await Payment.findByIdAndDelete(id);

    if (!deletedPayment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    return res.status(200).json({
      status: 200,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createPayment,
  retrievePayments,
  searchPayment,
  updatePayment,
  removePayment,
};
