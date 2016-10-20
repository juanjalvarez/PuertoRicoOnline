var express = require('express');
var router = express.Router();
var db = require('../models/database');

router.get('/', function(req, res, next){
	res.render('chattest', {
		auth:req.session.auth,
		layout: 'chat'
	});
});

module.exports = router;
