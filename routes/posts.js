'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const {sortPostsChronologically} = require ('../helper-functions');
const { io } = require('../utils/socket');
const router = express.Router();

/* GET ALL POSTS */
router.get('/:geo/:forum', (req, res, next) => {
  const coordsObject = JSON.parse(req.params.geo);
  const forum = req.params.forum;
  let filter;

  if(forum==='neighbors'){
    // each 0.014631 of latitude equals one mile (this varies very slightly because the earth isn't perfectly spherical, but is close enough to true for our use case)
  // see https://gis.stackexchange.com/questions/8650/measuring-accuracy-of-latitude-and-longitude for more info
    const latitudeMin = coordsObject.latitude - 0.014631;
    const latitudeMax = coordsObject.latitude + 0.014631;

    // the longitude to mile conversion varies greatly based on the input latitude, this calculation handles that conversion (from https://gis.stackexchange.com/questions/142326/calculating-longitude-length-in-miles)
    // one mile at my latitude (~34)is equal to 0.017457206881313057 degrees
    // one mile at the equator 0.01445713459592308804394968917161 degrees
    const oneDegreeLongitude = Math.cos(coordsObject.latitude * Math.PI/180) * 69.172;
    const oneMileLongitudeInDegrees = 1/oneDegreeLongitude;
    console.log(oneMileLongitudeInDegrees);
    const longitudeMin = coordsObject.longitude - oneMileLongitudeInDegrees;
    const longitudeMax = coordsObject.longitude + oneMileLongitudeInDegrees;

    filter = {'coordinates.latitude': {$gte: latitudeMin, $lte: latitudeMax}, 'coordinates.longitude': {$gte: longitudeMin, $lte: longitudeMax}, audience: forum};
  } 
  else{
    // each 0.014631 of latitude equals one mile (this varies very slightly because the earth isn't perfectly spherical, but is close enough to true for our use case)
  // see https://gis.stackexchange.com/questions/8650/measuring-accuracy-of-latitude-and-longitude for more info
    const latitudeMin = coordsObject.latitude - 0.073155;
    const latitudeMax = coordsObject.latitude + 0.073155;

    // the longitude to mile conversion varies greatly based on the input latitude, this calculation handles that conversion (from https://gis.stackexchange.com/questions/142326/calculating-longitude-length-in-miles)
    // one mile at my latitude (~34)is equal to 0.017457206881313057 degrees
    // one mile at the equator 0.01445713459592308804394968917161 degrees
    const oneDegreeLongitude = Math.cos(coordsObject.latitude * Math.PI/180) * 69.172;
    const fiveMilesLongitudeInDegrees = 5/oneDegreeLongitude;
    const longitudeMin = coordsObject.longitude - fiveMilesLongitudeInDegrees;
    const longitudeMax = coordsObject.longitude + fiveMilesLongitudeInDegrees;

    filter = {'coordinates.latitude': {$gte: latitudeMin, $lte: latitudeMax}, 'coordinates.longitude': {$gte: longitudeMin, $lte: longitudeMax}, audience: forum};
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

/*CREATE A POST*/
router.post('/:geo', (req, res, next) => {
  const newPost = req.body;
  const userId = req.user.id;
  newPost.userId = userId;
  newPost.coordinates = JSON.parse(req.params.geo);

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
      return Post.findById(post._id)
        .populate({
          path: 'comments',
          populate: { path: 'userId' }
        })
        .populate('userId');
    })
    .then(post => {
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
        io.emit('delete_post', post);
        res.sendStatus(204);
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;

