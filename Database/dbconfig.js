import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectDB = async () => {
    //   const MONGODB_URL = process.env.MONGODBCONNECTIONSTRING;
    const connection = await mongoose.connect(process.env.MONGODB_URL);
    console.log("connected to mongoDB");
    return connection;
};

export default connectDB;