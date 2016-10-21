var app = require('../app');
var io = app.io;
var session = app.session;

console.log('Starting socket server');

io.on('connection', function(socket){
	var username = socket.request.session.auth.username || 'User';
	console.log(username + ' has connected to livechat');

	socket.on('requestUsername', function(){
		socket.emit('receiveUsername', socket.request.session.auth.username);
	});

	socket.on('message', function(msg){
		var json = {
			author: socket.request.session.auth.username,
			message: msg
		}
		io.emit('messageReceive', json);
	});

	socket.on('disconnect', function(){
		console.log(username + ' has disconnected from livechat');
	});
});

console.log('Socket server started');
