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
      let promiseOne = User.find({_id: userId1, pinnedChatUsers:{$in: userId2}});
      let promiseTwo =User.find({_id: userId2, pinnedChatUsers:{$in: userId1}});
      //check if this chat exists in user's pinned chats already
      return Promise.all([promiseOne, promiseTwo]);
    })
    .then(([user1, user2])=>{
      console.log('USER1', user1, 'USER2', user2);
      if (user1.length===0 || user2.length===0 ){
        const pinChatToUserOnePromise = User.findByIdAndUpdate( {_id: userId1}, {$push: {pinnedChatUsers: userId2}}, {new: true});
        const pinChatToUserTwoPromise = User.findByIdAndUpdate( {_id: userId2}, {$push: {pinnedChatUsers: userId1}}, {new: true});
        return Promise.all([user1.length===0 && pinChatToUserOnePromise,  user2.length===0 && pinChatToUserTwoPromise]);
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