import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: {
    type: String, 
    required: true
  },
  email: {
    type: String, 
    required: true
  },
  full_name: {
    type: String, 
    required: true
  },
  username: {
    type: String, 
    required: true,
    unique: true
  },
  bio: {
    type: String, 
    default: 'Hey there! I am using PingUp'
  },
  profile_picture: {
    type: String, 
    default: ''
  },
  cover_photo: {
    type: String, 
    default: ''
  },
  location: {
    type: String, 
    default: ''
  },
  followers: [{
    type: String, 
    ref: 'Users'
  }],
  following: [{
    type: String, 
    ref: 'Users'
  }],
  connections: [{
    type: String, 
    ref: 'Users'
  }],
}, { timestamps: true, minimize: false });

export const User = mongoose.model('User', userSchema);