const api = require("./routes/api");
const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

const staticPath = path.join(__dirname, "public", "images");
// Serve static files (images) with caching headers
app.use(
  "/images",
  express.static(staticPath, {
    maxAge: "1d", // Set the maximum age for caching (1 day in this example)
    etag: true, // Enable ETag for RESTful API
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/", api);

module.exports = app;
