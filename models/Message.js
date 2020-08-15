const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
  sender: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: true
  },
  reciever: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: true
  },
  body: { type: String, required: true },
  date: { type: Number, default: Date.now() },
  status: { type: Number, default: 0 },
  media: []
});

module.exports = Message = mongoose.model('message', messageSchema);
