import mongoose from "mongoose";

const connectDB = async (uri: string) => {
  try {
    await mongoose.connect(uri);
    console.log("Database connected ✅");
  } catch (err) {
    console.log("Database couldn't be connected", err);
  }
};
export default connectDB;
