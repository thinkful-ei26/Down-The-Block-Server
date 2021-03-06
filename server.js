'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const cloudinary = require('cloudinary');

const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');

const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const chatRouter = require('./routes/chat');
const messageRouter = require('./routes/message');

const {CLIENT_ORIGIN, PORT, MONGODB_URI } = require('./config');
// const SocketManager = require('./utils/SocketManager');
const {socketIO, io, server, app } = require('./utils/socket'); 

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    'Access-Control-Allow-Credentials': true
  })
);

// Log all requests, skip during tests
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common', {
  skip: () => process.env.NODE_ENV === 'test'
}));

// Parse request body
app.use(express.json());

//Configure Passport to utilize the strategies, use them to create middleware fns, and pass in those middleware fns to the endpoints to authenticate and authorize access!
passport.use(localStrategy);
passport.use(jwtStrategy);

//we include this here so we don't have to for every single router endpoint
const options = {session: false, failWithError: true};
const jwtAuth = passport.authenticate('jwt', options);
const localAuth = passport.authenticate('local', options);

app.use('/posts', jwtAuth, postsRouter);
app.use('/messages', jwtAuth, messageRouter);
app.use('/chats', jwtAuth, chatRouter);
app.use('/comments', jwtAuth, commentsRouter);
app.use('/users', usersRouter);
app.use('/auth/login', localAuth, authRouter); //for login
app.use('/auth', authRouter); //for refresh
//Any endpoint that passes the jwtAuth strategy and is validted: The `req.user` has a value now because of `done(null, payload.user)` in JWT Strategy

// Custom 404 Not Found route handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Custom Error Handler
app.use((err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

if (require.main === module) {
  //  // Connect to DB and Listen for incoming connections
  mongoose.connect(MONGODB_URI, { useNewUrlParser:true }) //Mongo will automatically create the db here if it doesnt exist, and then mongoose will automatically create any collections that dont already exist by going through your models
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error('\n === Did you remember to start `mongod`? === \n');
      console.error(err);
    });

  server.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}

module.exports = app; // Export for testing