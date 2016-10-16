var mongoose = require('mongoose');
var fs = require('fs');

var dbString = fs.readFileSync('.dbconn', 'utf8').replace('\n', '');

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
	username: {
		type: String,
		unique: true,
		required: true
	},
	name: String,
	password: {
		type: String,
		required: true
	},
	facebook: {
		type: String,
		default: 'VOID'
	},
	img: {
		type: String,
		default: 'https://qph.ec.quoracdn.net/main-qimg-3b0b70b336bbae35853994ce0aa25013-c?convert_to_webp=true'
	}
});

const User = mongoose.model('User', userSchema);
module.exports.User = User;

var groupSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	}
});

const Group = mongoose.model('Group', groupSchema);
module.exports.Group = Group;

var groupsubSchema = mongoose.Schema({
	group: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Group',
		required: true
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
});

const GroupSub = mongoose.model('GroupSub', groupsubSchema);
module.exports.GroupSub = GroupSub;

var commentSchema = mongoose.Schema({
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	group:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Group',
		required: true
	},
	datetime: {
		type: Date,
		default: Date.now
	},
	text: String
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports.Comment = Comment;
