var express = require('express');
var router = express.Router();
var db = require('../models/database');

router.get('/', function(req, res, next) {
  res.render('home');
});

router.get('/commenttest', function(req, res, next){
	db.Comment.find({})
	.populate('author')
	.exec(function(err, comments){
		var json = {
			commentList: comments
		};
		res.render('commenttest', json);
	});
});

router.get('/register', function(req, res, next){
	res.render('register');
});

router.post('/register', function(req, res, next){
	var un = req.body.username;
	var existingUser = db.User.findOne({'username':un});
	if(existingUser.length > 0){
		res.render('redirect', {
			title: 'Could not register!',
			content: 'A user with the same username already exists'
		});
		return;
	}
	var newUser = new db.User({
		username: un,
		name: req.body.name,
		password: req.body.password
	});
	newUser.save(function(err, usr){
		if(err)
			console.log(err);
	});
	res.render('redirect', {
		title: 'Successfully registered'
	});
});

router.get('/login', function(req, res, next){
	res.render('login');
});

router.post('/login', function(req, res, next){
	var un = req.body.username;
	var pw = req.body.password;
	var user = db.User.findOne({'username':un});
	if(user){
		if(pw === user.password)
			console.log('valid login');
	}
});

module.exports = router;
