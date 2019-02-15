'use strict';

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  date: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  postId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }
});

//// Customize output for `res.json(data)`, `console.log(data)` etc.
commentSchema.set('toJSON', {
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
    delete ret.__v; //delete _v
  }
});

const Comment = mongoose.model('Comment', commentSchema); 

module.exports = Comment;
