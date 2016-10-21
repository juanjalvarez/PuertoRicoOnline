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
