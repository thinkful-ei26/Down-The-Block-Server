'use strict';

const express = require('express');
const Chat = require('../models/chat');
const User = require('../models/user');
const Message = require('../models/message');
const { io } = require('../utils/socket');

const router = express.Router(); 

let nsp={};

/*CREATE THE NAMESPACE*/
router.post('/:namespace', (req, res, next) => {
  nsp[req.params.namespace] = io.of(`/${req.params.namespace}`);
  res.json({namespace: req.params.namespace});
});

/* ========== CREATE A MESSAGE ========== */
router.put('/:namespace', (req, res, next) => {
  const { content, date, author, chatId } = req.body;
  const message = { content, author, date, chatId };

  console.log('1.THE MESSAGE IS', message);

  Message.create(message)
    .then(message => {
      console.log('2.CREATED MESSAGE IS', message);
      return Chat.findByIdAndUpdate( {_id: chatId}, {$push: {messages: message.id}}, {new: true})
        .populate({
          path: 'messages',
          populate: { path: 'author' }
        })
        .populate('participants');
    })
    .then(chat => {
      console.log('3.CHAT BEING SENT BACK IS', chat);
      nsp[req.params.namespace].emit('chat', chat);
      return res.status(201).json(chat);
    })
    .catch(err => next(err));
});

module.exports = router;