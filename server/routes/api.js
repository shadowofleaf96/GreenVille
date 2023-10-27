const express = require("express");
const userRoutes = require("../routes/userRoutes");
const categoryRoutes = require("../routes/categoryRoutes");
const productRouter = require("../routes/productRoute");
const ordersRouter = require("../routes/ordersRoute");
const custumerRoute = require('./customerRoute');
const subcategorieRoute = require('./subcategorieRoute');
const app = express();


app.use("/", productRouter);
app.use("/", ordersRouter);
app.use("/", userRoutes);
app.use("/", categoryRoutes);
app.use("/", custumerRoute);
app.use("/", subcategorieRoute);



module.exports = app