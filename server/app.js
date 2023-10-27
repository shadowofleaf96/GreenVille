const express = require("express");
const cookieParser = require("cookie-parser");


const route = require("./routes/api")

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(route)

module.exports = app

