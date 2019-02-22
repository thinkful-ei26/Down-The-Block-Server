'use strict';

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { JWT_SECRET, JWT_EXPIRY } = require('../config');
 
const router = express.Router();

router.post('/', (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

router.post('/refresh', (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

//this creates a new token 
router.post('/refresh-profile', (req, res, next) => {
  const userId = req.user.id;

  User.findById({_id: userId})
    .then(user=>{
      const authToken = createAuthToken(user);
      res.json({ authToken });
    })
    .catch(err=>{
      next(err);
    });
});


function createAuthToken(user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}

module.exports = router;
