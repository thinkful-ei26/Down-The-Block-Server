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

function calculateGeoFilterNeighbors(coordsObject){
  // each 0.014631 of latitude equals one mile (this varies very slightly because the earth isn't perfectly spherical, but is close enough to true for our use case)
  // see https://gis.stackexchange.com/questions/8650/measuring-accuracy-of-latitude-and-longitude for more info
  const latitudeMin = coordsObject.latitude - 0.014631;
  const latitudeMax = coordsObject.latitude + 0.014631;

  // the longitude to mile conversion varies greatly based on the input latitude, this calculation handles that conversion (from https://gis.stackexchange.com/questions/142326/calculating-longitude-length-in-miles)
  // one mile at my latitude (~34)is equal to 0.017457206881313057 degrees
  // one mile at the equator 0.01445713459592308804394968917161 degrees
  const oneDegreeLongitude = Math.cos(coordsObject.latitude * Math.PI/180) * 69.172;
  const oneMileLongitudeInDegrees = 1/oneDegreeLongitude;
  console.log(oneMileLongitudeInDegrees);
  const longitudeMin = coordsObject.longitude - oneMileLongitudeInDegrees;
  const longitudeMax = coordsObject.longitude + oneMileLongitudeInDegrees;

  return {'coordinates.latitude': {$gte: latitudeMin, $lte: latitudeMax}, 'coordinates.longitude': {$gte: longitudeMin, $lte: longitudeMax} };
}

function calculateGeoFilterCity(coordsObject){
  // each 0.014631 of latitude equals one mile (this varies very slightly because the earth isn't perfectly spherical, but is close enough to true for our use case)
  // see https://gis.stackexchange.com/questions/8650/measuring-accuracy-of-latitude-and-longitude for more info
  const latitudeMin = coordsObject.latitude - 0.073155;
  const latitudeMax = coordsObject.latitude + 0.073155;

  // the longitude to mile conversion varies greatly based on the input latitude, this calculation handles that conversion (from https://gis.stackexchange.com/questions/142326/calculating-longitude-length-in-miles)
  // one mile at my latitude (~34)is equal to 0.017457206881313057 degrees
  // one mile at the equator 0.01445713459592308804394968917161 degrees
  const oneDegreeLongitude = Math.cos(coordsObject.latitude * Math.PI/180) * 69.172;
  const fiveMilesLongitudeInDegrees = 5/oneDegreeLongitude;
  const longitudeMin = coordsObject.longitude - fiveMilesLongitudeInDegrees;
  const longitudeMax = coordsObject.longitude + fiveMilesLongitudeInDegrees;

  return {'coordinates.latitude': {$gte: latitudeMin, $lte: latitudeMax}, 'coordinates.longitude': {$gte: longitudeMin, $lte: longitudeMax}};
}

module.exports = { sortPostsChronologically, isEmpty, calculateGeoFilterNeighbors, calculateGeoFilterCity };