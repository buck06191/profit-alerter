/*jshint esversion: 6 */
'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const request = require('request');
const stream = require('stream');
var API_DOMAIN = "https://api.kraken.com";
var INTERVAL = 1; // Poll interval in seconds.
// set the port of our application
// process.env.PORT lets the port be set by Heroku
const PORT = process.env.PORT || 3000;



const server = express()
    .get('/', (req, res) => res.render('index'))
    .set('view engine', 'ejs')
    .use(express.static(__dirname + '/public'))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));
// set the view engine to ejs



// make express look in the public directory for assets (css/js/img
// set the home page route
/*app.get('/', function(req, res) {
    // ejs render automatically looks in the views folder
    res.render('index');
});*/


const io = socketIO(server);

io.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('close', () => console.log('Client disconnected'));
});

setInterval(() => {
    var url = API_DOMAIN;
    var timeURL = url + "/0/public/Time";
    var time = new stream.Writable();
    request(timeURL, function(err, response, body) {
        if (err) {
            console.log(err);
        } else {
            io.emit('time', body);
        }
    });
}, INTERVAL * 1000);
