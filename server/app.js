const api = require("./routes/api");
const cookieParser = require("cookie-parser");
const express = require("express");
require("dotenv").config();
const database = require('../server/config/database');


const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/", api);

module.exports = app;