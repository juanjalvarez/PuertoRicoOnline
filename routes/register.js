var express = require('express');
var router = express.Router();
var db = require('../models/database');

router.get('/', function(req, res, next){
	res.render('register');
});

router.post('/', function(req, res, next){
	var un = req.body.username;
	var existingUser = db.User.findOne({'username':un});
	if(existingUser.length > 0){
		console.log(req.body.username + ' already exists...');
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

module.exports = router;
