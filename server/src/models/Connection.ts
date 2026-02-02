import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({
  from_user_id: {
    type: String,
    ref: 'User',
    required: true
  },

  to_user_id: {
    type: String,
    ref: 'User',
    required: true
  },

  accepted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export const Connection = mongoose.model("Connection", connectionSchema);