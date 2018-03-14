const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const auth = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const sleep = require('system-sleep');
const hbs = require('handlebars');
const fs = require('fs');
const path = require('path');
const logger = require('morgan');

var index = require('./routes/index');
var users = require('./routes/users');

const mongoose = require('mongoose');
mongoose.set('debug', true);
const db = mongoose.createConnection('mongodb://admin:admin@ds111279.mlab.com:11279/pla25');

var dbready = false;
var connection = null;

db.then(function(conn) {
  connection = conn;
  dbready = true;
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'anfalf4gd(FNvT^^',
  resave: true,
  saveUninitialized: false
}));

passport.use(new auth({
  usernameField: 'username',
  passwordField: 'password',
  session: true
}, (un, pw, done) => {
  if (!dbready) {
    return done(null, false);
  }
  var ready = false;
  var user = false;
  connection.collection("users").findOne({
    "username": un,
    "password": pw
  }, function(err, result) {
    if (!err) {
      user = result;
    }
    ready = true;
  });
  while (!ready) {
    sleep(100);
  }
  return done(null, user);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
