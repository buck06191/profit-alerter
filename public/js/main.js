var socket = io();
console.log(socket);
var server_time = document.getElementById('server-time');
var pair_data = document.getElementById('pair-data');
var ticker_data = document.getElementById('ticker-data');
socket.on('time', function(object) {
  var timeString = JSON.parse(object);
  server_time.innerHTML = 'Server time: ' + timeString.result.rfc1123;
});

socket.on('pair', function(object) {
  var pairString = JSON.parse(object);
  console.log(pairString);
  pair_data.innerHTML = 'Pair Data: ' + pairString;
});

socket.on('ticker', function(object) {
  var tickerString = JSON.parse(object);
  console.log(tickerString);
  ticker_data.innerHTML = 'Ticker Data: ' + tickerString;
});
