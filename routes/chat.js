// 'use strict';

// const express = require('express');
// const Post = require('../models/post');
// const Chat = require('../models/chat');
// const User = require('../models/user');

// const { socketIO, io, server, app } = require('../utils/socket');
// const moment = require('moment');

// const router = express.Router();

// /* ========== POST/CREATE A CHAT ========== */
// router.post('/', (req, res, next) => {
//   const { content, date, currentUserId, recipientId, userId} = req.body;
//   const newChat = { content, userId, date, currentUserId, recipientId };

//   Chat.create(newChat)
//     .then(chat => {
//       return Post.findByIdAndUpdate( {_id: currentUserId}, {$push: {chats: chat.id}}, {new: true})
//         .populate({
//           path: 'chats',
//           populate: { path: 'userId' }
//         })
//         .populate('userId');
//     })
//     .then(post => {
//       io.emit('chat-message', post);
//       return res.status(201).location(`http://${req.headers.host}/chats/${chat.id}`).json(post);
//     })
//     .catch(err => next(err));
// });
// module.exports = router;