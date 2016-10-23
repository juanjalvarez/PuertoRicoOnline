var mongoose = require('mongoose');
var fs = require('fs');

//var dbString = fs.readFileSync('.dbconn', 'utf8').replace('\n', '');
var dbString = process.env.MONGODB_URI;

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
		type: Object,
		required: true
	},
	facebook: String,
	img: {
		type: String,
		default: 'https://leafii.com/images/defaultProfilePic.png'
	}
});

const User = mongoose.model('User', userSchema);
module.exports.User = User;

var groupSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	exclusive: {
		type: Boolean,
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

var messageSchema = mongoose.Schema({
	user: {
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

const Message = mongoose.model('Message', messageSchema);
module.exports.Message = Message;
