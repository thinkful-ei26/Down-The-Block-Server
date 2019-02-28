'use strict';

const express = require('express');
const Post = require('../models/post');
const Chat = require('../models/chat');
const User = require('../models/user');

const router = express.Router(); 

/* ========== POST/CREATE A MESSAGE ========== */
router.post('/:chatId', (req, res, next) => {
  const { content, date, authorUsername } = req.body;
  const newMessage = { content, authorUsername, date };
  const chatId = req.params

  Message.create(newMessage)
    .then(message => {
      return Chat.findByIdAndUpdate( {_id: chatId}, {$push: {messages: message.id, }}, {new: true})
        .populate({
          path: 'messages',
          populate: { path: 'userId' }
        })
        .populate('userId');
    })
    .then(chat => {
        console.log(chat); 
    //   io.emit('new_message', post);
      console.log(chat); 
      return res.status(201).location(`http://${req.headers.host}/messages/${chat.id}`).json(chat);
    })
    .catch(err => next(err));
});
