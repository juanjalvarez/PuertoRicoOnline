var express = require('express');
var router = express.Router();
var db = require('../models/database');

router.get('/chattest', function(req, res, next){
	res.render('chattest', {auth:req.session.auth});
});

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

router.post('/createcomment', function(req, res, next){
	db.Group.findOne({}, function(err, g){
		if(err){
			console.log(err);
			res.render('redirect', {
				auth: req.session.auth,
				title: 'Could not create new comment',
				url: '/commenttest'
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
					url: '/commenttest'
				});
				return;
			}
		});
		res.render('redirect',{
			auth: req.session.auth,
			title: 'Successfully created a new comment',
			url: '/commenttest'
		});
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
