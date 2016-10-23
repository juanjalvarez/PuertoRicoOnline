var express = require('express');
var router = express.Router();
var db = require('../models/database');

router.get('/', function(req, res, next) {
	req.session.lastUrl = req.originalUrl;
  res.render('home', {auth:req.session.auth});
});

router.get('/about', function(req, res, next){
	req.session.lastUrl = req.originalUrl;
	res.render('about', {auth:req.session.auth});
});

router.get('/login', function(req, res, next){
	res.render('login', {auth:req.session.auth});
});

router.get('/logout', function(req, res, next){
	req.session.auth = null;
	res.redirect(req.session.lastUrl || '/');
});

router.get('/register', function(req, res, next){
	res.render('register', {auth: req.session.auth});
});

module.exports = router;
