import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const url = process.env.DATABASE_URL || "";
    await mongoose.connect(url);
    console.log("Database connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
