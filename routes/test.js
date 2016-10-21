var express = require('express');
var router = express.Router();
var db = require('../models/database');

router.get('/messagetest', function(req, res, next){
	req.session.lastUrl = req.originalUrl;
	db.Message.find({})
	.populate('user')
	.exec(function(err, messages){
		var json = {
			messageList: messages,
			auth: req.session.auth
		};
		res.render('messagetest', json);
	});
});

router.post('/createmessage', function(req, res, next){
	db.Group.findOne({}, function(err, g){
		if(err){
			console.log(err);
			res.render('redirect', {
				auth: req.session.auth,
				title: 'Could not create new comment',
				url: '/test/messagetest'
			});
			return;
		}
		var newMsg = new db.Message({
			user: req.session.auth._id,
			group: g._id,
			text: req.body.text
		});
		newMsg.save(function(err){
			if(err){
				console.log(err);
				res.render('redirect', {
					auth: req.session.auth,
					title: 'Could not create new comment',
					url: '/test/messagetest'
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
