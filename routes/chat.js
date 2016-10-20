var express = require('express');
var router = express.Router();
var db = require('../models/database');

router.get('/', function(req, res, next){
	db.GroupSub.find({'user':req.session.auth._id})
	.populate('group')
	.exec(function(err, subscribedGroups){
		res.render('chat', {
			auth:req.session.auth,
			groupList:subscribedGroups,
			layout: false
		});
	});
});

module.exports = router;
