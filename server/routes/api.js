const express = require("express");
const userRoute = require("../routes/userRoutes");
const categoryRoute = require("../routes/categoryRoutes");
const productRoute = require("../routes/productRoute");
const ordersRoute = require("../routes/ordersRoute");
const customerRoute = require('./customerRoute');
const subcategoryRoute = require('./subcategoryRoute');
const app = express();


app.use("/v1/products", productRoute);
app.use("/v1/orders", ordersRoute);
app.use("/v1/users", userRoute);
app.use("/v1/categories", categoryRoute);
app.use("/v1/customers", customerRoute);
app.use("/v1/subcategories", subcategoryRoute);



module.exports = app