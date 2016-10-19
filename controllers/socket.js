var app = require('../app');
var io = app.io;
var session = app.session;

console.log('Starting socket server');

io.on('connection', function(socket){
	console.log('new connection');

	socket.on('message', function(msg){
		console.log(msg);
		socket.emit('r', socket.request.session.auth.username);
	});
});

console.log('Socket server started');
