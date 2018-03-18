var express = require('express');
var session = require('express-session');
var passport = require('./passport');
var router = express.Router();

var home = require('./home');
var api = require('./api');
var map = require('./map');
var login = require('./login');


module.exports = (app) => {

  app.use(session({
	secret: 'maikvur4#$^93C5rfg^re',
	resave: true,
	saveUninitialized: false
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(passport.authenticator);

  app.use('/', home);
  app.use('/api', api);
  app.use('/map', map);
  app.use('/login', login);

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler
  app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  return app;
};
