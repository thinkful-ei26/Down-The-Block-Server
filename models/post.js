'use strict';

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  category: { type: String, required: true },
  date: { type: String, required: true },
  content: { type: String, required: true },
  coordinates: { type: Object, required: true },
  photo: { type: Object },
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  audience: { type: String, required: true }
});

//// Customize output for `res.json(data)`, `console.log(data)` etc.
postSchema.set('toJSON', {
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
    delete ret.__v; //delete _v
  }
});

const Post = mongoose.model('Post', postSchema); 

module.exports = Post;