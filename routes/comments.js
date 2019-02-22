'use strict';

const express = require('express');
const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

const { socketIO, io, server, app } = require('../utils/socket');
const moment = require('moment');

const router = express.Router(); 

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const { content, postId, userId, date } = req.body;
  const newComment = { content, userId, date, postId };

  Comment.create(newComment)
    .then(comment => {
      return Post.findByIdAndUpdate( {_id: postId}, {$push: {comments: comment.id}}, {new: true})
        .populate({
          path: 'comments',
          populate: { path: 'userId' }
        })
        .populate('userId');
    })
    .then(post => {
      io.emit('new_comment', post);
      return res.status(201).location(`http://${req.headers.host}/posts/${post.id}`).json(post);
    })
    .catch(err => next(err));
});

module.exports = router;