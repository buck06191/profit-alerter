var socket = io();
console.log(socket);
var server_time = document.getElementById('server-time');

socket.on('time', function(object) {
  var timeString = JSON.parse(object);
  server_time.innerHTML = 'Server time: ' + timeString.result.rfc1123;
});
