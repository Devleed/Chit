const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: String,
  password: {
    type: String,
    required: true,
  },
  gender: String,
  register_date: {
    type: Date,
    default: Date.now(),
  },
  avatar: String,
  lastActive: Number,
});

module.exports = User = mongoose.model('user', userSchema);
