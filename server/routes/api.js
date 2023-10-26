const express = require("express");
const userRoutes = require("../routes/userRoutes");
const categoryRoutes = require("../routes/categoryRoutes");
const app = express();

app.use("/", userRoutes);
app.use("/", categoryRoutes);

module.exports = app