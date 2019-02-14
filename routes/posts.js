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
  const coordsObject = JSON.parse(req.params.geo);

  // each 0.014631 of latitude equals one mile (this varies very slightly because the earth isn't perfectly spherical, but is close enough to true for our use case)
  const latitudeMin = coordsObject.latitude - 0.014631;
  const latitudeMax = coordsObject.latitude + 0.014631;

  // the longitude to mile conversion varies greatly based on the input latitude, this calculation handles that conversion
  // ONE MILE AT MY LAT(~34) IS EQUAL TO 0.017457206881313057 degrees
  // ONE MILE AT THE EQUATOR IS EQUAL TO 0.01445713459592308804394968917161 DEGREES
  const oneDegreeLongitude = Math.cos(coordsObject.latitude * Math.PI/180) * 69.172;
  const oneMileLongitudeInDegrees = 1/oneDegreeLongitude;
  const longitudeMin = coordsObject.longitude - oneMileLongitudeInDegrees;
  const longitudeMax = coordsObject.longitude + oneMileLongitudeInDegrees;

  const locationSearch = {'coordinates.latitude': {$gte: latitudeMin, $lte: latitudeMax}, 'coordinates.longitude': {$gte: longitudeMin, $lte: longitudeMax}};

  Post.find(locationSearch)
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
  
  Post.create(newPost)
    .then((post)=>{
      return res.location(`http://${req.headers.host}/posts/${post.id}`).status(201).json(post);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
