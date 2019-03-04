'use strict';
const express = require('express');
const mongoose = require('mongoose');
const Chat = require('../models/chat');
const User = require('../models/user');
const Message = require('../models/message');

const { io } = require('../utils/socket');
const router = express.Router();

/* GET A SINGLE CHAT */
router.get('/:namespace/:userId1/:userId2', (req, res, next) => {
  const {namespace, userId1, userId2} = req.params; 
  let newChat = false;
  let finalChat;

  Chat.find({namespace})
    .then(chat => {
      //if the chat between these two users hasn't been created yet, create it
      if(chat.length===0){
        newChat=true;
        console.log('NO CHAT');
        return Chat.create({namespace: namespace, participants: [userId1, userId2]});
      }
      else{
        console.log('YES CHAT');
        return chat[0];
      }
    })
    .then(chat=>{
      finalChat=chat;
      if (newChat){
        const pinChatToUserOnePromise = User.findByIdAndUpdate( {_id: userId1}, {$push: {pinnedChatUsers: userId2}}, {new: true});
        const pinChatToUserTwoPromise = User.findByIdAndUpdate( {_id: userId2}, {$push: {pinnedChatUsers: userId1}}, {new: true});
        return Promise.all([pinChatToUserOnePromise, pinChatToUserTwoPromise]);
      }
      else{
        return Promise.resolve();
      }
    })
    .then(()=> {
      console.log('2. CHAT IS', finalChat);
      return Chat.findById({_id: finalChat._id})
        .populate({
          path: 'messages',
          populate: { path: 'author' }
        })
        .populate('participants');
    })
    .then(chat=>{
      console.log('3.CHAT IS', chat);
      return res.json(chat);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;