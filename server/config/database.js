const mongoose = require("mongoose");
require('dotenv').config({ path: '../.env' });

mongoose
  .connect(process.env.MONGOOSE, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });
