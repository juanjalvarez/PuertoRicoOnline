var express = require('express');
var router = express.Router();
var db = require('../models/database');

router.get('/', function(req, res, next) {
  res.render('home', {auth:req.session.auth});
});

router.get('/login', function(req, res, next){
	res.render('login', {auth:req.session.auth});
});

router.post('/login', function(req, res, next){
	var un = req.body.username;
	var pw = req.body.password;
	console.log(un + ' ' + pw);
	db.User.findOne({'username':un}, function(err, usr){
		if(usr){
			req.session.auth = usr;
			res.render('redirect', {
				title: 'Successfully logged in!',
				auth:req.session.auth
			});
		}else{
			res.render('redirect', {
				title: 'Failed to log in!',
				content: 'Wrong username or password',
				url: '/login',
				auth: req.session.auth
			});
		}
	});
});

router.get('/logout', function(req, res, next){
	req.session.auth = null;
	res.render('redirect', {
		title: 'Successfully logged out!',
		auth: req.session.auth
	});
});

router.get('/register', function(req, res, next){
	res.render('register', {auth: req.session.auth});
});

router.post('/register', function(req, res, next){
	var un = req.body.username;
	var existingUser = db.User.findOne({'username':un});
	if(existingUser.length > 0){
		res.render('redirect', {
			title: 'Could not register!',
			content: 'A user with the same username already exists',
			auth: req.session.auth
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
	req.session.auth = newUser;
	res.render('redirect', {
		title: 'Successfully registered',
		auth: req.session.auth
	});
});

module.exports = router;
