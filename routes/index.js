var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('home', {title: 'Express Title'});
});

router.get('/register', function(req, res, next){
	res.render('register', {});
});

router.post('/register', function(req, res, next){
	res.send(
		req.param('user') + "<br>" + req.query.password
	);
});

module.exports = router;
