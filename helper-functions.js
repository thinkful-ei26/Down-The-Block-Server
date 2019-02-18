'use strict';

function sortPostsChronologically(posts){
  return posts.sort((postA, postB)=> new Date(postB.date) - new Date(postA.date));
}

function isEmpty(obj) {
  for(let key in obj) {
    if(obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

module.exports = { sortPostsChronologically, isEmpty };