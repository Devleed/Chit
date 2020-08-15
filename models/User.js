const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  gender: String,
  register_date: {
    type: Date,
    default: Date.now()
  },
  avatar: {
    type: String,
    default: 'https://vectorified.com/images/empty-profile-picture-icon-14.png'
  }
});

module.exports = User = mongoose.model('user', userSchema);
