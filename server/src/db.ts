import mongoose from "mongoose";
import { mongoURI } from "./token";

const ENV = process.env.NODE_ENV || "development"; // will be set to 'test' by Jest during testing

const connectDB = async () => {
  try {
    if (ENV === "development") {
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      });
      console.log("MongoDB connected...");
    }
  } catch (err) {
    console.log(err.message);
    // exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
