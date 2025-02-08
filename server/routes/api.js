const express = require("express");
const userRoute = require("./userRoute");
const categoryRoute = require("./categoryRoute");
const ordersRoute = require("../routes/ordersRoute");
const customerRoute = require("./customerRoute");
const subcategoryRoute = require("./subcategoryRoute");
const productRoute = require("../routes/productRoute");
const homeRoute = require("../routes/homeRoute");
const reviewRoute = require("../routes/reviewRoute");
const paymentRoute = require("../routes/paymentRoute");
const notificationRoute = require("../routes/notificationRoute");
const couponRoute = require("../routes/couponRoute");
const contactRoute = require("../routes/contactRoute");
const app = express();

app.use("/v1/", homeRoute)
app.use("/v1/products", productRoute);
app.use("/v1/coupons", couponRoute);
app.use("/v1/contact", contactRoute);
app.use("/v1/orders", ordersRoute);
app.use("/v1/users", userRoute);
app.use("/v1/notifications", notificationRoute);
app.use("/v1/reviews", reviewRoute);
app.use("/v1/categories", categoryRoute);
app.use("/v1/customers", customerRoute);
app.use("/v1/payments", paymentRoute);
app.use("/v1/subcategories", subcategoryRoute);

module.exports = app;
