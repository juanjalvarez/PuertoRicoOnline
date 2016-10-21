var express = require('express');
var router = express.Router();
var db = require('../models/database');

router.get('/', function(req, res, next){
	req.session.lastUrl = req.originalUrl;
	db.Group.find({'exclusive':false}, function(err, g){
		res.render('grouplist', {
			auth: req.session.auth,
			groupList: g
		})
	});
});

router.get('/view/:group', function(req, res, next) {
	req.session.lastUrl = req.originalUrl;
	var gn = req.params.group
	db.Group.findOne({'name':gn}, function(err, g){
		if(err)
			console.log(err);
		db.GroupSub.find({group:g._id})
		.populate('user')
		.exec(function(err, s){
			if(err)
				console.log(err);
			res.render('group', {
				group: g,
				groupSubList: s,
				auth: req.session.auth
			});
		});
	});
});

router.get('/join/:group', function(req, res, next){
	if(!req.session.auth){
		res.render('redirect', {
			title: 'Failed to join group!',
			content: 'You are not signed in.',
			url: req.session.lastUrl,
			auth: req.session.auth
		});
		return;
	}
	db.Group.findOne({name:req.params.group}, function(err, g){
		if(err)
			console.log(err);
		var failed = false;
		db.GroupSub.findOne({'user':req.session.auth._id, 'group':g._id}, function(err, sub){
			if(sub){
				res.render('redirect', {
					auth: req.session.auth,
					title: 'Failed to subscribe to group!',
					content: 'You are already subscribed to this group',
					url: req.session.lastUrl
				});
				failed = true;
			}else {
				var newSub = new db.GroupSub({
					group: g._id,
					user: req.session.auth._id
				});
				newSub.save(function(err){
					if(err)
						console.log(err);
				});
				res.redirect(req.session.lastUrl || '/');
			}
		});
	});
});

router.get('/create', function(req, res, next){
	res.render('creategroup', {auth: req.session.auth});
});

router.post('/create', function(req, res, next){
	if(!req.session.auth){
		res.render('redirect', {
			title: 'Failed to create group!',
			content: 'You must be logged in to do this.',
			auth: req.session.auth,
			url: req.session.lastUrl
		});
		return;
	}
	var gn = req.body.groupname;
	var newGroup = new db.Group({
		name: gn,
		exclusive: false
	});
	newGroup.save(function(err){
		if(err){
			console.log(newGroup);
			console.log(err);
		}
	});
	var newSub = new db.GroupSub({
		group: newGroup._id,
		user: req.session.auth._id
	});
	newSub.save(function(err){
		if(err){
			console.log(newSub);
			console.log(err);
		}
	});
	res.redirect(req.session.lastUrl || '/');
});

module.exports = router;
