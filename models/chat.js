'use strict';

const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
  participants: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  namespace: { type: String }
});

//// Customize output for `res.json(data)`, `console.log(data)` etc.
chatSchema.set('toJSON', {
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
    delete ret.__v; //delete _v
  }
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
