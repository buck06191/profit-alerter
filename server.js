/*jshint esversion: 6 */
'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const request = require('request');
// Uncomment to debug
// require('request-debug')(request);
const stream = require('stream');
var API_DOMAIN = "https://api.kraken.com";
var INTERVAL = 3; // Poll interval in seconds.
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
    "pair": "ETHXBT,ETHEUR,XBTEUR"
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


var getPairs = function(url) {
    var pairsURL = url + "/0/public/AssetPairs";
    request({
      method: "GET",
      uri: pairsURL,
      qs: api_data
    }, function(err, response, body) {
      if (err){
        console.error(err);
      } else{
        var pairObject=JSON.parse(body);
        console.log(pairObject);
        io.emit('pair', body);
      }
    });
};




var profitCalculator = function(object){
  // console.log(object);
  var priceObject = {};
  for (var key in object){
    if (key.substr(key.length - 3)==="EUR"){
      priceObject[key] = {};
      priceObject[key].tot = object[key].a[0]*object[key].a[2];
      priceObject[key].ask = object[key].a[0];
      priceObject[key].vol = object[key].a[2];
    } else if (key.substr(key.length - 3)==="XBT"){
      priceObject[key] = {};
      priceObject[key].tot = object[key].b[0]*object[key].b[2];
      priceObject[key].ask = object[key].b[0];
      priceObject[key].vol = object[key].b[2];
    }
  }

  return priceObject;
};



var getOrder = function(url, pairName) {
  var pairNames = {
    "XBTEUR":["XXBTZEUR", "asks"],
    "ETHXBT":["XETHXXBT", "asks"],
    "ETHEUR":["XETHZEUR", "bids"]
  };
    var tickerURL = url + "/0/public/Depth";
    request({
      method: "GET",
      uri: tickerURL,
      qs: {pair: pairName}
    }, function(err, response, body) {
      if (err){
        console.error(err);
      } else{
        var orderObject = JSON.parse(body);
        var orderBook = orderObject.result[pairNames[pairName][0]][pairNames[pairName][1]];
        // console.log(orderBook);
        io.emit(pairName, orderBook);
      }
    });
};

var getTicker = function(url) {
    var tickerURL = url + "/0/public/Ticker";
    request({
      method: "GET",
      uri: tickerURL,
      qs: api_data
    }, function(err, response, body) {
      if (err){
        console.error(err);
      } else{
        var tickerObject = JSON.parse(body);
        var priceObject = profitCalculator(tickerObject.result);
        io.emit('ticker', priceObject);
      }
    });
};

setInterval(() => {
    var url = API_DOMAIN;
    // getTime(url);
    // getPairs(url);
    getTicker(url);
    getOrder(url,"XBTEUR");
    getOrder(url,"ETHXBT");
    getOrder(url,"ETHEUR");
}, INTERVAL * 1000);
