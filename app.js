var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/config.js');

var app = express();

var connectionString;
switch(app.get("env")) {
    case 'test': connectionString = config.db.test;
        break;
    default: connectionString = config.db.development;
}
mongoose.connect(connectionString);

var http = require('http').Server(app);
var io = require('socket.io')(http);
app.io           = io;

var RaceSchema = require('./models/race')(mongoose);
var UserSchema = require('./models/user')(mongoose);
var WaypointSchema = require('./models/waypoint')(mongoose);

var userSchema = mongoose.model("User");
var passport = require('./config/passport')(userSchema);

var races = require('./routes/races')(mongoose);
var users = require('./routes/users')(passport, mongoose);
var routes = require('./routes/index');

app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('express-session')({
    secret: 's3cr37',
    resave: true,
    saveUninitialized: false,
    cookie: { 
      expires: new Date(Date.now() + 60 * 10000), 
      maxAge: 60*10000
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// Session-persisted message middleware
app.use(function(req, res, next){
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
});

app.use('/', routes);
app.use('/races', races);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;