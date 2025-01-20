const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGOOSE, {
    serverSelectionTimeoutMS: 5000, 
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });
