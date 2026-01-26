import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/PingUp';

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URL).then(() => {
      console.log('Database connected');
    });
  } catch (err) {
    console.log(err);
  }
}

export default connectDB;