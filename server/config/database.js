import "dotenv/config";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE);
    console.log("Connected to the database");
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
};

connectDB();

export default connectDB;
