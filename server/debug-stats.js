import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Collections:",
      collections.map((c) => c.name),
    );
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
