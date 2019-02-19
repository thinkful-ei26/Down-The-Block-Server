'use strict';

const express = require('express');
const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

const router = express.Router(); 

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const { content, postId, userId } = req.body;
  console.log('the userID is', userId);
  const date = '2016-10-26';
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
      console.log('the result is', post);
      return res.status(201).location(`http://${req.headers.host}/posts/${post.id}`).json(post);
    })
    .catch(err => next(err));
    
});

module.exports = router;