var app = require('../app');
var io = app.io;
var session = app.session;
var db = require('../models/database');

console.log('Starting socket server');

io.on('connection', function(socket){
	var username = socket.request.session.auth.username || 'User';
	console.log(username + ' has connected to livechat');

	socket.on('requestUsername', function(){
		socket.emit('receiveUsername', socket.request.session.auth.username);
	});

	socket.on('message', function(json){
		var j = {
			author: socket.request.session.auth.username,
			message: json.message,
			group: json.group
		}
		var newMessage = new db.Message({
			user: socket.request.session.auth._id,
			group: json.group,
			text: json.message
		});
		newMessage.save(function(err){
			if(err)
				console.log(err);
		});
		io.emit('messageReceive', j);
	});

	socket.on('disconnect', function(){
		console.log(username + ' has disconnected from livechat');
	});

	socket.on('requestGroup', function(json){
		db.Message.find({'group':json.groupid})
		.populate('user')
		.exec(function(err, list){
			var commentList = [];
			list.forEach(function(elem){
				commentList.push({
					author: elem.user.username,
					message: elem.text
				});
			});
			var newJson = {
				commentlist: commentList
			}
			socket.emit('receiveGroup', newJson);
		});
	});
});

console.log('Socket server started');
