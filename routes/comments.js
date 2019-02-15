'use strict';

const express = require('express');
const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

const router = express.Router(); 

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
<<<<<<< HEAD
  
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
          console.log(post);
          return post.save();
        });
    })
    .then(result => {
      console.log(Post);
      console.log('3rd then');
      console.log(result);
      return res.status(201).location(`http://${req.headers.host}/comments/${result.id}`).json(result);
=======
  const { content, postId, userId } = req.body;
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
>>>>>>> 6badba3feb7a26dea7f0f475dfe6504508f38f7d
    })
    .catch(err => next(err));
    
});

module.exports = router;