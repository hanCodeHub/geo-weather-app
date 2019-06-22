const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./api/geocode');
const forecast = require('./api/forecast');

const app = express();
const port = process.env.PORT || 3000;

// define paths
const publicPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// configure templating engine
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// serve static assets
app.use(express.static(publicPath))

// define routes
app.get('', (req, res, next) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Han Xu',
        message: 'Use this site to get your weather forecast for the next 7 days.'
    })
})

app.get('/about', (req, res, next) => {
    res.render('about', {
        title: 'About page',
        avatarUrl: 'img/AvatarPortraitReduce.jpg',
        name: 'Han Xu'
    })
})

app.get('/help', (req, res, next) => {
    res.render('help', {
        title: 'Help page',
        name: 'Han Xu',
        message: 'I can help you!'
    })
})

class WeatherData {
    constructor(summary, temperatureHigh, temperatureLow, time) {
        this.summary = summary;
        this.temperatureHigh = temperatureHigh;
        this.temperatureLow = temperatureLow;
        this.day = this.getDay(time);

    }
    getDay(unix) {
        const numDate = new Date(unix * 1000);
        const numDay = numDate.getDay();

        switch (numDay) {
            case 0: return 'Sunday';
            case 1: return 'Monday';
            case 2: return 'Tuesday';
            case 3: return 'Wednesday';
            case 4: return 'Thursday';
            case 5: return 'Friday';
            case 6: return 'Saturday';
        }
    }
}

// WEATHER API ROUTE
app.get('/weather', (req, res, next) => {
    if (!req.query.address) {
        return res.send({ error: 'You must provide an address!' })
    } 
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, 
            (error, { today, day2, day3, day4, day5, day6, day7 }) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                location,
                forecast: {
                    today: new WeatherData(
                        today.summary, today.temperatureHigh, today.temperatureLow, today.time),
                    day2: new WeatherData(
                        day2.summary, day2.temperatureHigh, day2.temperatureLow, day2.time),
                    day3: new WeatherData(
                        day3.summary, day3.temperatureHigh, day3.temperatureLow, day3.time),
                    day4: new WeatherData(
                        day4.summary, day4.temperatureHigh, day4.temperatureLow, day4.time),
                    day5: new WeatherData(
                        day5.summary, day5.temperatureHigh, day5.temperatureLow, day5.time),
                    day6: new WeatherData(
                        day6.summary, day6.temperatureHigh, day6.temperatureLow, day6.time),
                    day7: new WeatherData(
                        day7.summary, day7.temperatureHigh, day7.temperatureLow, day7.time) 
                }
            })
        })
    })
})

// handle invalid route, * means everything matches
app.get('/help/*', (req, res, next) => {
    res.render('404', {
        name: 'Han Xu',
        title: 'Error: 404',
        message: 'Help article not found!'
    })
})

app.get('*', (req, res, next) => {
    res.render('404', {
        name: 'Han Xu',
        title: 'Error: 404',
        message: 'Page not found!'
    })
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
})