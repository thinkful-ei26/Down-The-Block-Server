'use strict';

const express = require('express');
const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

const { io } = require('../utils/socket');
const moment = require('moment');

const router = express.Router(); 

/* ========== POST/CREATE A COMMENT ========== */
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

/*EDIT A COMMENT*/
router.put('/:postId/:commentId', (req, res, next) => {
  const { commentId, postId } = req.params;
  const userId = req.user.id;
  const {content} = req.body;

  Comment.findOneAndUpdate({_id: commentId, userId}, content, {new: true})
    .then(()=>{
      return Post.findById (postId)
        .populate({
          path: 'comments',
          populate: { path: 'userId' }
        })
        .populate('userId');
    })
    .then((post) => {
      io.emit('edit_comment', post); 
      res.sendStatus(200);
    })
    .catch(err => {
      next(err);
    });
});

/* DELETE A COMMENT */
router.delete('/:postId/:commentId', (req, res, next) => {
  const { commentId, postId } = req.params;
  const userId = req.user.id;
  const commentDeletePromise =  Comment.findOneAndDelete({_id:commentId, userId});

  console.log('DELETING COMMENT', postId, commentId, userId);
  //also remove comment from the post's comments array
  const postCommentPullPromise = Post.findOneAndUpdate({_id: postId, userId}, { $pull: { comments: commentId } }, {new: true});

  return Promise.all([commentDeletePromise, postCommentPullPromise])
    .then((comment, post) => {
      if(!comment){
        // if trying to delete something that no longer exists or never did
        return next();
      }
      else{
        console.log('COMMENT BEING DELETED', comment[0]);
        return Post.findById(postId)
          .populate({
            path: 'comments',
            populate: { path: 'userId' }
          })
          .populate('userId');
      }
    })
    .then((post) => {
      console.log('DATA BEING SENT BACK TO CLIENT', post); 
      io.emit('delete_comment', post); 
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;