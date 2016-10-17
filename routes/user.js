var express = require('express');
var router = express.Router();
var db = require('../models/database');

router.get('/', function(req, res, next){
	db.User.find({}).exec(function(err, users){
		res.render('userlist', {
			userList: users
		});
	});
});

router.get('/:user', function(req, res, next) {
	var un = req.params.user
	db.User.findOne({'username':un}, function(err, u){
		res.render('user', u);
	});
});

module.exports = router;
