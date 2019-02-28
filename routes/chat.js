'use strict';
const express = require('express');
const Chat = require('../models/chat');
const User = require('../models/user');

// const { socketIO, io, server, app } = require('../utils/socket');

const router = express.Router();



/* GET A SINGLE CHAT */
router.get('/:chatId', (req, res, next) => {

  const chatId = req.params; 

  Chat.findById({_id:chatId})
    .populate({
      path: 'messages',
      populate: { path: 'userId' }
    })
    .populate('userId')
    .then(messages => {
      return res.json(messages);
    })
    .catch(err => {
      next(err);
    });
});


/* ========== POST/CREATE A CHAT ========== */
router.post('/', (req, res, next) => {
  const { date, currentUser, recipientUser } = req.body;
  const newChat = { date, currentUser, recipientUser };

  Chat.create(newChat)
    .then(chat => {
      return User.findByIdAndUpdate( {_id: recipientUser.id}, {$push: {chats: {participant:currentUser.id , chatId:chat.id}}}, {new: true})
    })
    .then(user=> {
      console.log(user);
      const index = user.chats.length - 1;
      return res.status(201).location(`http://${req.headers.host}/chats/${user.chats[index].chatId}`).json(user.chats[index].chatId);
    })
    .then( () => {
      return User.findByIdAndUpdate( {_id:currentUser.id }, {$push: {chats: {participant: recipientUser.id , chatId:chat.id}}}, {new: true})
    })
    .catch(err => next(err));
});

module.exports = router;