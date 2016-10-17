var express = require('express');
var router = express.Router();
var db = require('../models/database');

router.get('/', function(req, res, next) {
  res.render('home');
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

module.exports = router;
