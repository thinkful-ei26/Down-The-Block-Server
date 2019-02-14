'use strict';

const express = require('express');

const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

const router = express.Router();

/* GET GEOLOCATED POSTS */
router.get('/:geo', (req, res, next) => {
  // console.log(req.params.geo);
  let parsedJSON = JSON.parse(req.params.geo);
  console.log(parsedJSON);
  Post.find({})
    .populate('comments')
    .populate('userId')
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      next(err);
    });
});

// /* GET GEOLOCATED POSTS */

// router.get('/', (req, res, next) => {
  
//   console.log(req);


//   Post.find({})
//     .populate('comments')
//     .populate('userId')
//     .then(posts => {
//       res.json(posts);
//     })
//     .catch(err => {
//       next(err);
//     });
// });

module.exports = router;
