const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGOOSE, { useNewUrlParser: true }).then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to Database:", error);
  });
