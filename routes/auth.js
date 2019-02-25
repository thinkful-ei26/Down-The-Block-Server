'use strict';

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const localStrategy = require('../passport/local');
const jwtStrategy = require('../passport/jwt');

const User = require('../models/user');

const { JWT_SECRET, JWT_EXPIRY } = require('../config');
 
const router = express.Router();

//Configure Passport to utilize the strategies, use them to create middleware fns, and pass in those middleware fns to the endpoints to authenticate and authorize access!
passport.use(localStrategy);
passport.use(jwtStrategy);

//we include this here so we don't have to for every single router endpoint
const options = {session: false, failWithError: true};
const jwtAuth = passport.authenticate('jwt', options);
const localAuth = passport.authenticate('local', options);

function createAuthToken(user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}

router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

router.post('/refresh', jwtAuth, (req, res) => {
  console.log('IN REFRESH ENDPOINT, USER IS', req.user)
  const authToken = createAuthToken(req.user);
  console.log('IN REFRESH ENDPOINT, TOKEN IS', authToken)
  res.json({ authToken });
});

//this creates a new token 
// router.post('/refresh-profile', (req, res, next) => {
//   const userId = req.user.id;

//   User.findById({_id: userId})
//     .then(user=>{
//       const authToken = createAuthToken(user);
//       res.json({ authToken });
//     })
//     .catch(err=>{
//       next(err);
//     });
// });

module.exports = router;
