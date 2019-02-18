'use strict';

const comments = [
  {
    _id: '333333333333333333333301',
    date: '2018-10-26',
    content: 'Lolol, this is a funny comment',
    userId: '000000000000000000000002',
    postId: '222222222222222222222201'
  },
  {
    _id: '333333333333333333333302',
    date: '2017-11-26',
    content: 'This is also a funny comment!',
    userId: '000000000000000000000002',
    postId: '222222222222222222222201',
  },
  {
    _id: '333333333333333333333303',
    date: '2019-01-26',
    content: 'Oh No!',
    userId: '000000000000000000000001',
    postId: '222222222222222222222202',
  },
  {
    _id: '333333333333333333333304',
    date: '2019-01-28',
    content: 'Was anyone hurt?!',
    userId: '000000000000000000000001',
    postId: '222222222222222222222202',
  }
];

const posts = [
  {
    _id: '222222222222222222222201',
    category: 'Personal',
    date: '2016-10-26',
    coordinates: {latitude: 34.155650699999995, longitude: -118.46158659999999},
    comments: ['333333333333333333333301', '333333333333333333333302'],
    content: 'Throwing a party this sat night',
    userId: '000000000000000000000001'
  },
  {
    _id: '222222222222222222222202',
    category: 'Crime',
    date: '2018-10-26',
    coordinates: {latitude: 34.155650699999995, longitude: -118.46158659999999},
    comments: ['333333333333333333333303', '333333333333333333333304'],
    content: 'Robbery on east side of Noble. Be safe',
    userId: '000000000000000000000002'
  }
];

const users = [
  {
    _id: '000000000000000000000001',
    firstName: 'Nikkie',
    lastName: 'Mashian',
    username: 'nikmash',
    // hash for "password"
    password: '$2a$10$QJCIX42iD5QMxLRgHHBJre2rH6c6nI24UysmSYtkmeFv6X8uS1kgi',
    photo: { 
      public_id: 'q0xyt2foximjiotzf4ry',
      url:
     'https://res.cloudinary.com/dnn1jf0pl/image/upload/v1550277125/q0xyt2foximjiotzf4ry.jpg' }
  },
  {
    _id: '000000000000000000000002',
    firstName: 'Steve',
    lastName: 'Anderson',
    username: 'steve',
    // hash for "password"
    password: '$2a$10$QJCIX42iD5QMxLRgHHBJre2rH6c6nI24UysmSYtkmeFv6X8uS1kgi',
    photo: { 
      public_id: 'q0xyt2foximjiotzf4ry',
      url:
     'https://res.cloudinary.com/dnn1jf0pl/image/upload/v1550277125/q0xyt2foximjiotzf4ry.jpg' 
    }
  }
];

module.exports = { comments, posts, users };
