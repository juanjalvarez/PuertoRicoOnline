var db = require('./database');
var sync = require('sync');

var callback = function(err){
	if(err)
		console.log(err);
}

sync(function(){

	db.User.remove({}, function(err){
		if(err)
			console.log(err);
		console.log('Emptied User');
	});

	db.Group.remove({}, function(err){
		if(err)
			console.log(err);
		console.log('Emptied Group');
	});

	db.GroupSub.remove({}, function(err){
		if(err)
			console.log(err);
		console.log('Emptied GroupSub');
	});

	db.Message.remove({}, function(err){
		if(err)
			console.log(err);
		console.log('Emptied Comment');
	});

	var userList = [
		new db.User({
			username: 'juanjalvarez',
			name: 'Juan J. Alvarez',
			password: '12345'
		}),
		new db.User({
			username: 'raulroque',
			name: 'Raul III Roque',
			password: '12345'
		}),
	];
	userList.forEach(function(u){
		u.save(callback);
	});

	var groupList = [
		new db.Group({
			name: 'Global',
			exclusive: false
		})
	];
	groupList.forEach(function(g){
		g.save(callback);
	});

	var messageList = [
		new db.Message({
			user: userList[0]._id,
			group: groupList[0]._id,
			text: 'msg1'
		}),
		new db.Message({
			user: userList[1]._id,
			group: groupList[0]._id,
			text: 'msg2'
		}),
	];

	messageList.forEach(function(c, index){
		c.save(callback);
	});
});
