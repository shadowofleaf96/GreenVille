const api = require("./routes/api");
const cookieParser = require("cookie-parser");
const express = require("express");
require("dotenv").config({ path: "../.env" });
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: ["https://greenville-frontend.onrender.com","http://localhost:5173"]
  })
);

const staticPath = path.join(__dirname, "public", "images");
app.use(
  "/images",
  express.static(staticPath, {
    maxAge: "1d",
    etag: true,
  })
);

app.use(express.json());

app.use("/", api);

module.exports = app;
