import mongoose from "mongoose"; 
 
const messageSchema = new mongoose.Schema({
  _id: {
    type: String, 
    required: true
  },

  conversation_id: {
    type: String,
    ref: 'Conversation',
    required: true
  },

  sender_id: {
    type: String,
    ref: 'User',
    required: true
  },

  text: {
    type: String,
    trim: true,
  },

  message_type: {
    type: String,
    enum: ['text', 'image'],
  },

  media_url: {
    type: String,
  },

  seen: {
    type: Boolean,
    default: false
  }
}, { timestamps: true, minimize: false });

export const Message = mongoose.model('Message', messageSchema);