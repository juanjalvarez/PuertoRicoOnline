var mongoose = require('mongoose');
var fs = require('fs');

var dbString = '';
fs.readFile('.dbconn', 'utf8', function(err, data){
	if(err)
		console.log(err);
	else
		dbString += data;
});

mongoose.connect(dbString);

var dbprefix = 'DATABASE: ';

const db = mongoose.connection;

db.on('error', function(err){
	console.log(dbprefix + err.message);
});

db.once('open', function(stat){
	console.log(dbprefix + 'Successfully connected to database');
});

var userSchema = mongoose.Schema({
	userid: mongoose.Schema.Types.ObjectId,
	username: String,
	name: String,
	password: String,
	facebook: String
});

var User = mongoose.model('User', userSchema);

var groupSchema = mongoose.Schema({
	id: mongoose.Schema.Types.ObjectId,
	name: String
});

var Group = mongoose.model('Group', groupSchema);

var groupsubSchema = mongoose.Schema({
	groupid: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Group'
	},
	userid: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
});

var commentSchema = mongoose.Schema({
	id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	groupid:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Group'
	},
	datetime: Date,
	comment: String
});

var Comment = mongoose.model('Comment', commentSchema);
