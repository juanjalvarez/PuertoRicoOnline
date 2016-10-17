var express = require('express');
var router = express.Router();
var db = require('../models/database');

router.get('/commenttest', function(req, res, next){
	db.Comment.find({})
	.populate('author')
	.exec(function(err, comments){
		var json = {
			commentList: comments,
			auth: req.session.auth
		};
		res.render('commenttest', json);
	});
});

router.get('/cookietest', function(req, res, next){
	if(!req.session.views)
		req.session.views = 0;
	req.session.views++;
	res.render('cookietest', {
		views: req.session.views,
		auth: req.session.auth
	});
});

module.exports = router;
