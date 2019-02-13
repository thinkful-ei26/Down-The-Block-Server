'use strict';

function sortPostsChronologically(posts){
  return posts.sort((postA, postB)=> new Date(postB.date) - new Date(postA.date));
}

module.exports = { sortPostsChronologically }