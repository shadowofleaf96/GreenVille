// Shadow Of Leaf was Here

const Order = require("../models/Order");
const Product = require("../models/Product");

const CreateOrders = (req, res) => {
  const orderItems = req.body.order_items.map((item) => ({
    product_id: item.product_id,
    quantity: item.quantity,
  }));

  // Fetch product details and calculate total price for each item
  const promises = orderItems.map(async (item) => {
    try {
      const product = await Product.findById(item.product_id); // Assuming you have a Product model
      const total_price = product.price * item.quantity;
      return total_price;
    } catch (err) {
      throw new Error(`Error fetching product details: ${err.message}`);
    }
  });

  // Wait for all promises to resolve
  Promise.all(promises)
    .then((totalPrices) => {
      // Sum up the total prices to get cart_total_price
      const cartTotalPrice = totalPrices.reduce((acc, price) => acc + price, 0);

      const orders = new Order({
        customer_id: req.body.customer_id,
        order_items: orderItems,
        order_date: req.body.order_date,
        cart_total_price: cartTotalPrice,
        status: req.body.status,
      });

      orders
        .save()
        .then((data) => {
          res.status(200).json({
            message: "Order created successfully",
            data: data,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err.message,
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err.message,
      });
    });
};

const RetrievingOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;

    const findQuery = Order.find();
    const countQuery = Order.countDocuments();

    const [orders, totalOrders] = await Promise.all([
      findQuery
        .skip((page - 1) * perPage)
        .limit(perPage)
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
      order_items: order.order_items.map((item) => ({
        product: item.product_id,
        quantity: item.quantity,
      })),
    }));

    res.status(200).json({
      data: modifiedOrders,
    });
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
    // Extracting only the relevant fields from the request body
    const { customer_id, status, cart_total_price } = newData;
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        customer_id,
        status,
        cart_total_price,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json({
      status: 200,
      message: "Order updated successfully",
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
