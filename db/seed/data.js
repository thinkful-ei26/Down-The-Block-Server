'use strict';

const comments = [
  {
    _id: '333333333333333333333301',
    date: 'Wednesday, February 20, 2019 2:05 PM',
    content: 'Am I invited?',
    userId: '000000000000000000000002',
    postId: '222222222222222222222201'
  },
  {
    _id: '333333333333333333333302',
    date: 'Wednesday, February 20, 2019 3:05 PM',
    content: 'Jk jk, have fun!',
    userId: '000000000000000000000002',
    postId: '222222222222222222222201',
  },
  {
    _id: '333333333333333333333303',
    date: '2019-01-26',
    content: 'Wednesday, February 20, 2019 7:05 PM',
    userId: '000000000000000000000001',
    postId: '222222222222222222222202',
  },
  {
    _id: '333333333333333333333304',
    date: 'Wednesday, February 20, 2019 8:05 PM',
    content: 'Did they take a lot of valuable things? :(',
    userId: '000000000000000000000001',
    postId: '222222222222222222222202',
  }
];

const posts = [
  {
    _id: '222222222222222222222201',
    category: 'Personal',
    date: 'Wednesday, February 20, 2019 3:35 PM',
    coordinates: {latitude: 34.155650699999995, longitude: -118.46158659999999},
    comments: ['333333333333333333333301', '333333333333333333333302'],
    content: 'Throwing a party this sat night, apologize in advance for any noise! Please dont call the po-po',
    audience: 'neighbors',
    userId: '000000000000000000000001'
  },
  {
    _id: '222222222222222222222202',
    category: 'Crime',
    date: 'Wednesday, February 20, 2019 5:35 PM',
    coordinates: {latitude: 34.155650699999995, longitude: -118.46158659999999},
    comments: ['333333333333333333333303', '333333333333333333333304'],
    content: 'There was a robbery on east side of Noble last night. No one was home, but the robbers escaped before authorities arrived.',
    audience: 'city',
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
      public_id: 'etvoulcit8gibp3tcju1',
      url:
     'https://res.cloudinary.com/dnn1jf0pl/image/upload/v1550530310/etvoulcit8gibp3tcju1.jpg' }
  },
  {
    _id: '000000000000000000000002',
    firstName: 'Steve',
    lastName: 'Anderson',
    username: 'steve',
    // hash for "password"
    password: '$2a$10$QJCIX42iD5QMxLRgHHBJre2rH6c6nI24UysmSYtkmeFv6X8uS1kgi',
  }
];

module.exports = { comments, posts, users };
