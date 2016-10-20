var express = require('express');
var router = express.Router();
var db = require('../models/database');

router.get('/', function(req, res, next){
	db.Group.find({}, function(err, g){
		res.render('grouplist', {
			auth: req.session.auth,
			groupList: g
		})
	});
});

router.get('/create', function(req, res, next){
	res.render('newgroup', {auth: req.session.auth});
});

router.get('/join/:group', function(req, res, next){
	if(!req.session.auth){
		res.render('redirect', {
			title: 'Failed to join group!',
			content: 'You are not signed in.',
			url: '/group'
		});
		return;
	}
	db.Group.findOne({name:req.params.group}, function(err, g){
		if(err)
			console.log(err);
		var newSub = new db.GroupSub({
			group: g._id,
			user: req.session.auth._id
		});
		newSub.save(function(err){
			if(err)
				console.log(err);
		});
		res.render('redirect', {
			title: 'Successfully subscribed to ' + req.params.group + '!',
			url: '/group/' + req.params.group,
			auth: req.session.auth
		});
	});
});

router.get('/:group', function(req, res, next) {
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

module.exports = router;
