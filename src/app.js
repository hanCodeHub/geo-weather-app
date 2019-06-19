const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./api/geocode');
const forecast = require('./api/forecast');

const app = express();

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
        message: 'Use this site to get your weather!'
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

// WEATHER API ROUTE
app.get('/weather', (req, res, next) => {
    if (!req.query.address) {
        return res.send({ error: 'You must provide an address!' })
    } 
    geocode(req.query.address, (error, { latitude, longitude, location }= {}) => {
        if (error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, skyData) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                location: location,
                temperature: skyData.temperature,
                forecast: skyData.summary
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

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})