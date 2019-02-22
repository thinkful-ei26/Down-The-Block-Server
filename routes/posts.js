'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const {sortPostsChronologically, calculateGeoFilterNeighbors, calculateGeoFilterCity} = require ('../helper-functions');
const { io } = require('../utils/socket');
const router = express.Router();

/* GET ALL POSTS */
router.get('/:geo/:forum', (req, res, next) => {
  const coordsObject = JSON.parse(req.params.geo);
  const forum = req.params.forum;
  let filter;

  if(forum==='neighbors'){
    filter = calculateGeoFilterNeighbors(coordsObject);
    filter.audience = forum;
  } 
  else{
    filter = calculateGeoFilterCity(coordsObject);
    filter.audience = forum;
  }

  Post.find(filter)
    .populate({
      path: 'comments',
      populate: { path: 'userId' }
    })
    .populate('userId')
    .then(posts => {
      sortPostsChronologically(posts);
      return res.json(posts);
    })
    .catch(err => {
      next(err);
    });
});

/*CREATE A POST IN REAL TIME (only send back if within geo, otherwise send back no post) */
router.post('/:geo/:forum', (req, res, next) => {
  const newPost = req.body;
  const userId = req.user.id;
  newPost.userId = userId;
  let coordinates = JSON.parse(req.params.geo);
  newPost.coordinates = coordinates;

  const forum = req.params.forum;
  let filter;

  if(forum==='neighbors'){
    filter = calculateGeoFilterNeighbors(coordinates);
    filter.audience = forum;
  } 
  else{
    filter = calculateGeoFilterCity(coordinates);
    filter.audience = forum;
  }

  if(!newPost.category || !newPost.date || !newPost.content || !newPost.coordinates || !newPost.audience){
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
      filter._id = post._id;
      console.log('THE FILTER IS', filter);
      return Post.findOne(filter)
        .populate({
          path: 'comments',
          populate: { path: 'userId' }
        })
        .populate('userId');
    })
    .then(post => {
      console.log('THE POST BEING SENT BACK IS', post);
      io.emit('new_post', post);
      return res.location(`http://${req.headers.host}/posts/${post.id}`).status(201).json(post);
    })
    .catch(err => {
      next(err);
    });
});

/*EDIT A POST*/
router.put('/:postId', (req, res, next) => {
  const editedPost = req.body;
  const postId = req.params.postId;
  const userId = req.user.id;
  editedPost.userId = userId;

  if(!editedPost.category || !editedPost.date || !editedPost.content || !editedPost.audience){
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
      return Post.findOneAndUpdate({_id: postId, userId: userId}, {category: editedPost.category, content: editedPost.content}, {new: true})
        .populate({
          path: 'comments',
          populate: { path: 'userId' }
        })
        .populate('userId');
    })
    .then((post) => {
      console.log('EDITED POST BEING SENT BAC', post);
      io.emit('edited_post', post);
      res.status(200);
    })
    .catch(err => {
      next(err);
    });
});

/* DELETE A POST */
router.delete('/:postId', (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user.id;

  const postDeletePromise =  Post.findOneAndDelete({_id:postId, userId});
  const commentsDeletePromise =  Comment.deleteMany({postId:postId});


  return Promise.all([postDeletePromise, commentsDeletePromise])
    .then((post) => {
      if(!post){
        // if trying to delete something that no longer exists or never did
        return next();
      }
      else{
        io.emit('delete_post', post[0]);
        res.sendStatus(204);
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;

