// 'use strict';

// const mongoose = require('mongoose');

// const chatSchema = new mongoose.Schema({
//   date: { type: String, required: true },
//   content: { type: String, required: true },
//   image: { type: String },
//   messagess: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
// //   audience: { type: String, required: true }
// });

// //// Customize output for `res.json(data)`, `console.log(data)` etc.
// chatSchema.set('toJSON', {
//   virtuals: true,     // include built-in virtual `id`
//   transform: (doc, ret) => {
//     delete ret._id; // delete `_id`
//     delete ret.__v; //delete _v
//   }
// });

// const Chat = mongoose.model('Chat', ChatSchema); 

// module.exports = Chat;
'use strict';

const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
  date: { type: String, required: true },
  currentUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true  },
  recipientUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
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
