const express = require("express");
const userRoutes = require("../routes/userRoutes");
const categoryRoutes = require("../routes/categoryRoutes");
const productRouter = require("../routes/productRoute");
const ordersRouter = require("../routes/ordersRoute");
const app = express();


app.use("/", productRouter);
app.use("/", ordersRouter);
app.use("/", userRoutes);
app.use("/", categoryRoutes);


module.exports = app
