const Order = require("../models/Order");
const Product = require("../models/Product");

const CreateOrders = async (req, res) => {
  const orderItems = req.body.order_items;
  try {
    const newOrder = new Order({
      customer_id: req.body.customer_id,
      order_items: orderItems,
      order_date: req.body.order_date,
      cart_total_price: req.body.cart_total_price,
      status: req.body.status || "open",
      shipping_address: req.body.shipping_address,
      shipping_method: req.body.shipping_method,
      shipping_status: req.body.shipping_status || "not_shipped",
      order_notes: req.body.order_notes,
    });

    const savedOrder = await newOrder.save();

    res.status(200).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
};

const RetrievingOrders = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : null;
    const perPage = 10;

    const findQuery = Order.find();
    const countQuery = Order.countDocuments();

    if (page) {
      findQuery.skip((page - 1) * perPage).limit(perPage);
    }

    const [orders, totalOrders] = await Promise.all([
      findQuery
        .populate("customer_id", "first_name last_name email")
        .populate({
          path: "order_items.product_id",
          select: "product_name price",
        })
        .lean(),
      countQuery,
    ]);

    const modifiedOrders = orders.map((order) => ({
      _id: order._id,
      customer: order.customer_id,
      order_date: order.order_date,
      cart_total_price: order.cart_total_price,
      status: order.status,
      shipping_address: order.shipping_address,
      shipping_method: order.shipping_method,
      shipping_status: order.shipping_status,
      order_notes: order.order_notes,
      order_items: order.order_items.map((item) => ({
        product: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
    }));

    res.status(200).json({
      data: modifiedOrders,
      total: totalOrders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserOrders = async (req, res) => {
  const userId = req.params.userId;

  try {
    const userOrders = await Order.find({ customer_id: userId })
      .populate("customer_id", "first_name last_name email")
      .populate({
        path: "order_items.product_id",
        select: "product_name discount_price product_images",
      })
      .lean();

    if (userOrders.length === 0) {
      return res.status(404).json({ error: "No orders found for this user" });
    }

    const modifiedOrders = userOrders.map((order) => ({
      _id: order._id,
      customer: order.customer_id,
      order_date: order.order_date,
      cart_total_price: order.cart_total_price,
      status: order.status,
      shipping_address: order.shipping_address,
      shipping_method: order.shipping_method,
      shipping_status: order.shipping_status,
      order_notes: order.order_notes,
      is_review_allowed: order.is_review_allowed,
      order_items: order.order_items.map((item) => ({
        product: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
    }));

    return res.status(200).json({ orders: modifiedOrders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const searchingOrders = async (req, res) => {
  const id = req.params.id;
  try {
    const orderById = await Order.findById(id)
      .populate("customer_id", "first_name last_name email")
      .populate({
        path: "order_items.product_id",
        select: "product_name price",
      });

    if (!orderById) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json(orderById);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const UpdateOrdersById = async (req, res) => {
  const id = req.params.id;
  const newData = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        customer_id: newData.customer_id,
        status: newData.status,
        cart_total_price: newData.cart_total_price,
        shipping_address: newData.shipping_address,
        shipping_method: newData.shipping_method,
        shipping_status: newData.shipping_status,
        order_notes: newData.order_notes,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json({
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const DeleteOrdersById = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  CreateOrders,
  RetrievingOrders,
  searchingOrders,
  getUserOrders,
  UpdateOrdersById,
  DeleteOrdersById,
};
