var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var http = require('http');
var localStrategy = require('passport-local').Strategy;

var routes = require('./routes/index');
var users = require('./routes/users');
var directory = require('./routes/directory');
var cnn = require('./routes/cnn');
var messenger = require('./routes/messenger');

var app = express();

//socket.io
var server = require('http').Server(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function(req, res, next) {
	res.io = io;
	next();
});
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
	secret:'keyboard cat',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',routes);
app.use('/directory', directory);
app.use('/cnn', cnn);
app.use('/messenger', messenger);

//passport config
var Account = require('./models/account');
passport.use(new localStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

//mongoose
mongoose.Promise = global.Promise;
const options = {
	useMongoClient : true
}
//local db connection
mongoose.connect('mongodb://localhost/node-auth', options)
	.then(() => console.log('connection successful'))
	.catch((err) => console.error(err));

/*//production db connection
mongoose.connect(process.env.MONGODB_URI, options)
	.then(() => console.log('connection successful'))
	.catch((err) => console.error(err));
*/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler

//development error handler
//will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
	  	res.status(err.status || 500);
		res.render('error', {
			message:err.message,
			error: err
		});
	});
}

//production error handler
//no stacttraces Leaked to user
app.use(function(err, req, res, next) {
  	res.status(err.status || 500);
	res.render('error', {
		message:err.message,
		error: {}
	});
});


module.exports = {app: app, server: server};