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
	req.session.lastUrl = req.originalUrl;
  res.render('home', {auth:req.session.auth});
});

router.get('/about', function(req, res, next){
	req.session.lastUrl = req.originalUrl;
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
			console.log(req.session.lastUrl);
			res.redirect(req.session.lastUrl || '/');
		}else
			redirect(req, res, 'Failed to log in!', 'Wrong username or password', '/login');
	});
});

router.get('/logout', function(req, res, next){
	req.session.auth = null;
	res.redirect(req.session.lastUrl || '/');
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
	db.Group.findOne({'name':'Global'}, function(err, glb){
		var newSub = new db.GroupSub({
			group: glb._id,
			user: newUser._id
		});
		newSub.save(function(err){
			if(err)
				console.log(err);
		});
	});
	req.session.auth = newUser;
	res.redirect(req.session.lastUrl || '/');
});

module.exports = router;
