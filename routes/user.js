var express = require('express');
var router = express.Router();
var db = require('../models/database');

router.get('/', function(req, res, next){
	req.session.lastUrl = req.originalUrl;
	db.User.find({}).exec(function(err, users){
		res.render('userlist', {
			userList: users,
			auth: req.session.auth
		});
	});
});

router.get('/settings', function(req, res, next){
	db.User.findOne({'_id':req.session.auth._id}).exec(function(err, usr){
		var json = {
			auth: req.session.auth
		}
		res.render('settings', json);
	});
});

router.post('/updatesettings', function(req, res, next){
	var newName = req.body.name;
	var newImg = req.body.img;
	req.session.auth.name = newName;
	req.session.auth.img = newImg;
	db.User.update({'_id':req.session.auth._id}, {
		name: newName,
		img: newImg
	}, function(err, numberAffected, rawResponse){
		if(err)
			console.log(err);
	});
	res.redirect(req.session.lastUrl);
});

router.get('/:user', function(req, res, next) {
	req.session.lastUrl = req.originalUrl;
	var un = req.params.user
	db.User.findOne({'username':un}, function(err, u){
		db.GroupSub.find({'user':u._id})
		.populate('group')
		.exec(function(err, subs){
			res.render('user', {
				user: u,
				groupSubList: subs,
				auth: req.session.auth
			});
		});
	});
});

module.exports = router;
