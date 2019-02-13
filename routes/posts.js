'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const {sortPostsChronologically} = require ('../helper-functions');

const router = express.Router();

/* GET ALL POSTS */
router.get('/', (req, res, next) => {
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
router.post('/', (req, res, next) => {
  const newPost = req.body;
  const userId = req.user.id;
  newPost.userId = userId;

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
  
  Post.create(newPost)
    .then((post)=>{
      return res.location(`http://${req.headers.host}/posts/${post.id}`).status(201).json(post);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
