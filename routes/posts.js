'use strict';

const express = require('express');

const Post = require('../models/post');
const Comment = require('../models/comment');

const router = express.Router();

/* GET ALL PAWFILES */
router.get('/', (req, res, next) => {
  Post.find({})
    .populate('comments')
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
