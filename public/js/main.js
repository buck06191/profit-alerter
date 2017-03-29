var socket = io();
console.log(socket);
var server_time = document.getElementById('server-time');

socket.on('time', function(object) {
  var timeString = JSON.parse(object);
  server_time.innerHTML = 'Server time: ' + timeString.result.rfc1123;
});

socket.on('pair', function(object) {
  var pairString = JSON.parse(object);
  console.log(pairString);
  server_time.innerHTML = 'Server time: ' + pairString;
});

socket.on('ticker', function(object) {
  var tickerString = JSON.parse(object);
  console.log(tickerString);
  server_time.innerHTML = 'Server time: ' + tickerString;
});
