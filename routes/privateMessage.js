// 'use strict';

// const express = require('express');
// const Post = require('../models/post');
// const Chat = require('../models/chat');
// const User = require('../models/user');

// const { socketIO, io, server, app } = require('../utils/socket');
// const moment = require('moment');

// const router = express.Router(); 

// /* ========== POST/CREATE A MESSAGE ========== */
// router.post('/:recieverid/:senderid', (req, res, next) => {
//   const { content, chatId, userId, date } = req.body;
//   const newComment = { content, userId, date, postId };

//   Chat.create(newMessage)
//     .then(message => {
//       return Chat.findByIdAndUpdate( {_id: chatId}, {$push: {messages: message.id}}, {new: true})
//         .populate({
//           path: 'messages',
//           populate: { path: 'userId' }
//         })
//         .populate('userId');
//     })
//     .then(post => {
//       io.emit('new_message', post);
//       return res.status(201).location(`http://${req.headers.host}/privatemessages/${message.id}`).json(message);
//     })
//     .catch(err => next(err));
// });