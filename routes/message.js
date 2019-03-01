'use strict';

const express = require('express');
const Chat = require('../models/chat');
const User = require('../models/user');
const Message = require('../models/message');
const { io } = require('../utils/socket');

const router = express.Router(); 

/* ========== CREATE A MESSAGE ========== */
router.post('/:namespace', (req, res, next) => {
  let {namespace} = req.params;
  let nsp = io.of(`/${namespace}`);

  console.log('THE NAMESPACE IS', nsp);

  const { content, date, authorName, chatId } = req.body;
  const message = { content, authorName, date, chatId };

  console.log('1.THE MESSAGE IS', message);

  Message.create(message)
    .then(message => {
      console.log('2.CREATED MESSAGE IS', message);
      return Chat.findByIdAndUpdate( {_id: chatId}, {$push: {messages: message.id}}, {new: true})
        .populate({
          path: 'messages',
        });
    })
    .then(chat => {
      console.log('3.CHAT BEING SENT BACK IS', chat);
      nsp.emit('chat', chat);
      return res.status(201).location(`http://${req.headers.host}/messages/${chat.id}`).json(chat);
    })
    .catch(err => next(err));
});

module.exports = router;