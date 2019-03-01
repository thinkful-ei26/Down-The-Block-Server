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

  console.log('1.', namespace, userId1, userId2);

  Chat.find({namespace})
    .then(chat => {
      //if the chat between these two users hasn't been created yet, create it
      if(chat.length===0){
        console.log('NO CHAT');
        return Chat.create({namespace: namespace, participants: [userId1, userId2]});
      }
      else{
        console.log('YES CHAT');
        return chat[0];
      }
    })
    .then(chat=> {
      console.log('2. CHAT IS', chat);
      return Chat.findById({_id: chat._id})
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