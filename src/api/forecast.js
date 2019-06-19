const request = require('request');

const forecast = (latitude, longitude, callback) => {
    const weatherUrl = `https://api.darksky.net/forecast/48103c7d1d7c28245c60fa72d955afb0/${latitude},${longitude}?`;
    
    request({ url: weatherUrl, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather service!', null);
        } else if (body.error) {
            callback(`Unable to find location: ${body.error}`, null);
        } else {
            callback(null, {
                summary: body.daily.data[0].summary,
                temperature: body.currently.temperature,
                precipitation: body.currently.precipProbability
            });
        }
    })
}

module.exports = forecast;