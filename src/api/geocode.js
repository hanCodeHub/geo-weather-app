const request = require('request');

// Geocoding with Mapbox
const geocode = (address, callback) => {
    const access_token = 'pk.eyJ1IjoiaGFuY29kZXIiLCJhIjoiY2p4MmNsb3N2MGo1OTN5bzRtNWxiMWMycSJ9.Cv7YzKlDgf808urxc09iWA';
    const limit = '1';
    const geoUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${encodeURIComponent(access_token)}&limit=${limit}`
    
    request({ url: geoUrl, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to Mapbox!', null);
        } else if (body.message) {
            callback(`Bad request: ${body.message}`, null);
        } else {
            callback(null, {
                longitude: body.features[0].center[0],
                latitude: body.features[0].center[1],
                location: body.features[0].place_name
            })
        }
    })
}

module.exports = geocode;