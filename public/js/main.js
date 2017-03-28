var socket = io();
console.log(socket);
var el = document.getElementById('server-time');

socket.on('time', function(object) {
  var timeString = JSON.parse(object);
    el.innerHTML = 'Server time: ' + timeString.result.rfc1123;
});
