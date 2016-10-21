var express = require('express');
var router = express.Router();
var db = require('../models/database');

router.get('/commenttest', function(req, res, next){
	req.session.lastUrl = req.originalUrl;
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

router.post('/createcomment', function(req, res, next){
	db.Group.findOne({}, function(err, g){
		if(err){
			console.log(err);
			res.render('redirect', {
				auth: req.session.auth,
				title: 'Could not create new comment',
				url: '/test/commenttest'
			});
			return;
		}
		var newComment = new db.Comment({
			author: req.session.auth._id,
			group: g._id,
			text: req.body.text
		});
		newComment.save(function(err){
			if(err){
				console.log(err);
				res.render('redirect', {
					auth: req.session.auth,
					title: 'Could not create new comment',
					url: '/test/commenttest'
				});
				return;
			}
		});
		res.redirect(req.session.lastUrl || '/');
	});
});

router.get('/cookietest', function(req, res, next){
	req.session.lastUrl = req.originalUrl;
	if(!req.session.views)
		req.session.views = 0;
	req.session.views++;
	res.render('cookietest', {
		views: req.session.views,
		auth: req.session.auth
	});
});

module.exports = router;
