var app = require('../app');
var io = app.io;
var session = app.session;

console.log('Starting socket server');

io.on('connection', function(socket){
	console.log('new connection');

	socket.on('message', function(msg){
		console.log(msg);
		var json = {
			author: socket.request.session.auth.username,
			message: msg
		}
		io.emit('messageReceive', json);
	});
});

console.log('Socket server started');
