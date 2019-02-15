'use strict';

const express = require('express');
const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

const router = express.Router(); 

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
    const { content, postId, userId } = req.body
    console.log('requestBody', req.body);
    const date = '2016-10-26';
    const newComment = { content, userId, date, postId };
    console.log(newComment);
    User.findById({_id:userId})
    .then(()=> {
      console.log(newComment);
      console.log('1st then');
      return Comment.create(newComment); 
    })
    .then(comment => {
      console.log('2nd then');
      console.log(comment);
      return Post.findById({_id:postId})
        .then(post => {
          console.log(post);
          post.comments.push(comment._id);
          return post.save();
        });
    })
    .then(result => {
      console.log('3rd then');
      console.log(result);
      return res.status(201).location(`http://${req.headers.host}/comments/${result.id}`).json(result);
    })
    .catch(err => next(err));
});

module.exports = router;