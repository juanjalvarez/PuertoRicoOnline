var express = require('express');
var router = express.Router();
var db = require('../models/database');

function redirect(req, res, _title, _content, _url){
	res.render('redirect', {
		title: _title,
		content: _content,
		url: _url,
		auth: req.session.auth
	});
}

router.get('/', function(req, res, next) {
  res.render('home', {auth:req.session.auth});
});

router.get('/about', function(req, res, next){
	res.render('about', {auth:req.session.auth});
});

router.get('/login', function(req, res, next){
	res.render('login', {auth:req.session.auth});
});

router.post('/login', function(req, res, next){
	var un = req.body.username;
	var pw = req.body.password;
	db.User.findOne({'username':un}, function(err, usr){
		if(usr && pw === usr.password){
			req.session.auth = usr;
			redirect(req, res, 'Successfully logged in!', null, null);
		}else
			redirect(req, res, 'Failed to log in!', 'Wrong username or password', '/login');
	});
});

router.get('/logout', function(req, res, next){
	req.session.auth = null;
	redirect(req, res, 'Successfully logged out!', null, null);
});

router.get('/register', function(req, res, next){
	res.render('register', {auth: req.session.auth});
});

router.post('/register', function(req, res, next){
	var un = req.body.username;
	var existingUser = db.User.findOne({'username':un});
	if(existingUser.length > 0){
		redirect(req, res, 'Failed to register!', 'A user with the username \'' + un + '\' already exists.', '/register');
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
	redirect(req, res, 'Successfully registered!', null, null);
});

module.exports = router;
