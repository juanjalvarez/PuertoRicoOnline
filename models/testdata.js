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

	db.Comment.remove({}, function(err){
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
			username: 'franniieexd',
			name: 'Frances K. Fragela',
			password: '12345'
		}),
		new db.User({
			username: 'ronaldmcdonald',
			password: '12345'
		}),
	];
	userList.forEach(function(u){
		u.save(callback);
	});

	var groupList = [
		new db.Group({
			name: 'Group1',
			exclusive: false
		})
	];
	groupList.forEach(function(g){
		g.save(callback);
	});

	var commentList = [
		new db.Comment({
			author: userList[0]._id,
			group: groupList[0]._id,
			text: 'comment1'
		}),
		new db.Comment({
			author: userList[1]._id,
			group: groupList[0]._id,
			text: 'comment2'
		}),
		new db.Comment({
			author: userList[2]._id,
			group: groupList[0]._id,
			text: 'comment3'
		}),
	];

	commentList.forEach(function(c, index){
		c.save(callback);
	});
});
