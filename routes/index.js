var express = require('express');
var router = express.Router();
var db = require('../models/database');

router.get('/', function(req, res, next) {
  res.render('home', {title: 'Express Title'});
});

router.get('/t', function(req, res, next){
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
	res.render('register', {});
});

router.post('/register', function(req, res, next){
	res.render('redirect', {
		title: 'Successfully registered!',
		content: req.param('username') + " : " + req.param('password'),
		url: '/'
	});
});

module.exports = router;
