'use strict';

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  date: { type: String, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true  },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

//// Customize output for `res.json(data)`, `console.log(data)` etc.
messageSchema.set('toJSON', {
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
    delete ret.__v; //delete _v
  }
});

const Message = mongoose.model('Message', messageSchema); 

module.exports = Message;