/*jshint esversion: 6 */
'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const request = require('request');
const stream = require('stream');
var API_DOMAIN = "https://api.kraken.com";
var INTERVAL = 10; // Poll interval in seconds.
// set the port of our application
// process.env.PORT lets the port be set by Heroku
const PORT = process.env.PORT || 3000;


// set the view engine to ejs
// make express look in the public directory for assets (css/js/img
// set the home page route
const server = express()
    .get('/', (req, res) => res.render('index'))
    .set('view engine', 'ejs')
    .use(express.static(__dirname + '/public'))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));


const io = socketIO(server);

io.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('close', () => console.log('Client disconnected'));
});

// Define API data

var api_data = {
    "pair": ["ETHXBT", "ETHEUR", "XBTEUR"],
};

// Define API polling functions

var getTime = function(url) {
    var timeURL = url + "/0/public/Time";
    request({
        method: "GET",
        url: timeURL
    }, function(err, response, body) {
        if (err) {
            console.log(err);
        } else {
            io.emit('time', body);
        }
    });
};


var getPairs = function(url, data) {
    var pairsURL = url + "/0/public/AssetPairs";
    request({
      method: "GET",
      uri: pairsURL,
      qs: api_data
    }, function(err, response, body) {
      if (err){
        console.error(err);
      } else{
        console.log("Response: " + response);
        console.log("Body: " + body);
      }
    });
};

var getTicker = function(url, data) {
    var tickerURL = url + "/0/public/Ticker";
    request({
      method: "GET",
      uri: tickerURL,
      qs: api_data
    }, function(err, response, body) {
      if (err){
        console.error(err);
      } else{
        console.log("Response: " + response);
        console.log("Body: " + body);
      }
    });
};

setInterval(() => {
    var url = API_DOMAIN;
    getTime(url);
    getPairs(url);
    getTicker(url);
}, INTERVAL * 1000);
