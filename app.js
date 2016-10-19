var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var db = require('./models/database');
var fs = require('fs');
var mongoose = require('mongoose');
var express_session = require('express-session');
var MongooseStore = require('connect-mongo')(express_session);
var session = express_session({
	store: new MongooseStore({mongooseConnection: mongoose.connection}),
	secret: 'jf902jf9723douhSLPe9g87fy8o3774gkljh8932q74hf08q34hgjkdfhg',
	cookie: {
		maxAge: 3600000
	},
	resave: true,
	saveUninitialized: false
});

module.exports.session = session;

var hbs = exphbs.create({
  defaultLayout: 'main'
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', '/images/fav.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// setup sessions
console.log('Initializing session');
app.use(session);

var index = require('./routes/index');
app.use('/', index);

var user = require('./routes/user');
app.use('/user', user);

var test = require('./routes/test');
app.use('/test', test);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
