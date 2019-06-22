const request = require('request');

const forecast = (latitude, longitude, callback) => {
    const weatherUrl = `https://api.darksky.net/forecast/48103c7d1d7c28245c60fa72d955afb0/${latitude},${longitude}?`;
    
    request({ url: weatherUrl, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined);
        } else if (body.error) {
            callback(`Unable to find location: ${body.error}`, undefined);
        } else {
            callback(undefined, {
                today: body.daily.data[0],
                day2: body.daily.data[1],
                day3: body.daily.data[2],
                day4: body.daily.data[3],
                day5: body.daily.data[4],
                day6: body.daily.data[5],
                day7: body.daily.data[6]
            });
        }
    })
}

module.exports = forecast;