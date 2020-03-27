const { default: axios } = require('axios');
const { of } = require('await-of');

const isCoords = RegExp(/^([-+]?\d{1,2}[.]\d+),\s*([-+]?\d{1,3}[.]\d+)$/);
function GeocodePlace(placeID) {
  return of(axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: {
      key: process.env.GOOGLE_MAP_KEY,
      place_id: placeID,
    },
  }));
}
function GeocodeLocation(latitude, longitude) {
  return of(axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: {
      key: process.env.GOOGLE_MAP_KEY,
      latlng: `${latitude},${longitude}`,
    },
  }));
}


module.exports = {
  isCoords,
  GeocodePlace,
  GeocodeLocation,
};
