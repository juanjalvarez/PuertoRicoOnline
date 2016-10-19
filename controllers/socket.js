var www = require('../bin/www');
var io = www.io;
var session = www.app.session;
//var expresssession = require('express-socket.io-session');

console.log('Starting socket server');

//io.use(expresssession(session));

io.on('connection', function(socket){
	console.log('new connection');
	socket.on('message', function(msg){
		console.log(msg);
	});
});

console.log('Socket server started');
