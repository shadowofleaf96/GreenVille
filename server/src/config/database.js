import "dotenv/config";
import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1", "1.0.0.1"]);

const connectDB = async (retries = 5) => {
  try {
    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
    };

    await mongoose.connect(process.env.MONGOOSE, options);
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error(
      `❌ Error connecting to the database (${retries} retries left):`,
      err.message,
    );

    if (retries > 0) {
      console.log(`Retrying in 5 seconds...`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return connectDB(retries - 1);
    }

    console.error("Failed to connect to database after multiple attempts");
    process.exit(1);
  }
};

connectDB();

export default connectDB;
