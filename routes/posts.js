'use strict';

const express = require('express');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary');
const formData = require('express-form-data');
const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const {sortPostsChronologically, calculateGeoFilterNeighbors, calculateGeoFilterCity, isEmpty} = require ('../helper-functions');
const { io } = require('../utils/socket');
const router = express.Router();
router.use(formData.parse());


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
  let photo, post; 
  console.log('the newPost is', newPost);

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
    .then(newPost=> {
      post = newPost;
      if(!isEmpty(req.files)){
        console.log('2. UPLOADING TO CLOUDINARY');
        photo = Object.values(req.files);
        // first upload the image to cloudinary
        return cloudinary.uploader.upload(photo[0].path);
      }
      else{
        console.log('2. NOT UPLOADING TO CLOUDINARY');
        return null;
      }
    })
    .then(results => {
      if(results){
        console.log('3. CLOUDINARY RESULTS:', results);
        photo = {
          public_id: results.public_id,
          url: results.secure_url,
        };
        return Post.findOneAndUpdate({_id: post._id}, {photo: photo}, {new: true} )
          .populate({
            path: 'comments',
            populate: { path: 'userId' }
          })
          .populate('userId');
      }
      else{
        console.log('3. NO RESULTS:');
        return Post.findById(post._id)
          .populate({
            path: 'comments',
            populate: { path: 'userId' }
          })
          .populate('userId');
      }
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
      return res.location(`http://${req.headers.host}/posts/${post.id}`).status(201).json(post);
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
        console.log('here1');
        // if trying to delete something that no longer exists or never did
        return next();
      }
      else{
        console.log('here2');
        io.emit('delete_post', post[0]);
        res.sendStatus(204);
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;

