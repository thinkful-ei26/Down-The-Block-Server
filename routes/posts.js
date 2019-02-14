'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const {sortPostsChronologically} = require ('../helper-functions');

const router = express.Router();

/* GET ALL POSTS */
router.get('/:geo', (req, res, next) => {
  Post.find({})
    .populate({
      path: 'comments',
      populate: { path: 'userId' }
    })
    .populate('userId')
    .then(posts => {
      sortPostsChronologically(posts);
      res.json(posts);
    })
    .catch(err => {
      next(err);
    });
});

/*CREATE A POST*/
router.post('/:geo', (req, res, next) => {
  const newPost = req.body;
  const userId = req.user.id;
  newPost.userId = userId;
  newPost.coordinates = JSON.parse(req.params.geo);

  if(!newPost.category || !newPost.date || !newPost.content || !newPost.coordinates){
    //this error should be displayed to user incase they forget to add a note. Dont trust client!
    const err = {
      message: 'Missing information for the post!',
      reason: 'MissingContent',
      status: 400,
      location: 'post'
    };
    return next(err);
  }

  console.log(newPost);
  
  Post.create(newPost)
    .then((post)=>{
      console.log('here5');
      return res.location(`http://${req.headers.host}/posts/${post.id}`).status(201).json(post);
    })
    .catch(err => {
      console.log('here6');
      next(err);
    });
});

/*EDIT A POST*/
router.put('/:postId', (req, res, next) => {
  const editedPost = req.body;
  const postId = req.params.postId;
  const userId = req.user.id;
  editedPost.userId = userId;

  if(!editedPost.category || !editedPost.date || !editedPost.content){
    //this error should be displayed to user incase they forget to add a note. Dont trust client!
    const err = {
      message: 'Missing information for the post!',
      reason: 'MissingContent',
      status: 400,
      location: 'post'
    };
    return next(err);
  }

  //check if user is authorized to update this post
  Post.find({_id: postId, userId})
    .then(()=>{
      return Post.findOneAndUpdate({_id: postId, userId: userId}, editedPost, {new: true}).populate('comments');
    })
    .then((post) => {
      res.status(200).json(post);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;

