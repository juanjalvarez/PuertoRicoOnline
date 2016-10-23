var express = require('express');
var router = express.Router();
var db = require('../models/database');
var cred = require('credential')();

router.post('/login', function(req, res, next){
	var un = req.body.username;
	var pw = req.body.password;
	db.User.findOne({'username':un}, function(err, usr){
		cred.verify(usr.password, pw, function(err, valid){
			if(valid){
				req.session.auth = usr;
				res.redirect(req.session.lastUrl || '/');
			}else
				redirect(req, res, 'Failed to log in!', 'Wrong username or password', '/login');
		});
	});
});

router.post('/register', function(req, res, next){
	var un = req.body.username;
	var existingUser = db.User.findOne({'username':un});
	if(existingUser.length > 0){
		redirect(req, res, 'Failed to register!', 'A user with the username \'' + un + '\' already exists.', '/register');
		return;
	}
	cred.hash(req.body.password, function(err, hash){
		if(err)
			console.log(err);
		var newUser = new db.User({
			username: un,
			name: req.body.name,
			password: hash
		});
		newUser.save(function(err, usr){
			if(err)
				console.log(err);
		});
		req.session.auth = newUser;
	});
	res.redirect(req.session.lastUrl || '/');
});

module.exports = router;
