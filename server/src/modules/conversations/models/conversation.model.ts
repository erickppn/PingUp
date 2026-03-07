import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  _id: {
    type: String, 
    required: true
  },

  participants: [{
    type: String,
    ref: 'User',
    required: true
  }],

  last_message: {
    type: String,
    ref: 'Message',
  }
}, { timestamps: true, minimize: false });

export const Conversation = mongoose.model('Conversation', conversationSchema);