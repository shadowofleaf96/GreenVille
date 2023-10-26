const express = require("express");
const session = require("express-session");
const passport = require("passport");
const database = require('../server/config/database');
const api = require("./routes/api");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();

// Middleware
app.use(
  session({
    secret: process.env.SECRETKEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // This makes me debug for hours, and it is simple
    },
  })
);

app.use(cookieParser());
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

app.use("/", api);

module.exports = app;