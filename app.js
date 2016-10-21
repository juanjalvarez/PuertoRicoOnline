#!/usr/bin/env node

console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');

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
//app.use(logger('dev'));
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

var group = require('./routes/group');
app.use('/group', group);

var chat = require('./routes/chat');
app.use('/chat', chat);

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
var debug = require('debug')('PuertoRicoOnline:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = 8081;
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, function(){
	console.log('Server started on port ' + port);
});
server.on('error', onError);
server.on('listening', onListening);

var io = require('socket.io')(server);

io.use(function(socket, next){
	session(socket.request, socket.request.res, next);
});

module.exports.io = io;
require('./controllers/socket.js');

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
