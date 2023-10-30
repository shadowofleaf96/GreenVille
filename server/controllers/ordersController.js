// Shadow Of Leaf was Here

const Order = require("../models/Order");

const CreateOrders = (req, res) => {
  const orders = new Order({
    customer_id: req.body.customer_id,
    order_items: req.body.order_items,
    order_date: req.body.order_date,
    cart_total_price: req.body.cart_total_price,
    status: req.body.status,
    price: req.body.price,
  });
  orders
    .save()
    .then((result) => {
      res.status(201).json(orders);
    })
    .catch((err) => {
      console.log(err);
    });
};

const RetrievingOrders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 10;

  try {
    const orders = await Order.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("customer_id", "first_name last_name email") // Populate customer information
      .lean(); // Convert Mongoose document to plain JavaScript object

    const modifiedOrders = orders.map((order) => {
      // Return modified order object with only required fields
      return {
        _id: order._id,
        customer: order.customer_id,
        order_date: order.order_date,
        cart_total_price: order.cart_total_price,
        status: order.status,
      };
    });

    res.json(modifiedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const searchingOrders = async (req, res) => {
  const id = req.params.id;
  try {
    const orderById = await Order.findById(id);

    if (!orderById) {
      return res.status(404).json({ error: "Product not found" });
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
    const updatedORder = await Order.findByIdAndUpdate(id, newData, {
      new: true,
    });

    if (!updatedORder) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({
      status: 200,
      message: "Orders updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  CreateOrders,
  RetrievingOrders,
  searchingOrders,
  UpdateOrdersById,
};
