var express = require('express');
var session = require('express-session');
var router = express.Router();

var home = require('./home');
var api = require('./api');
var map = require('./map');
var login = require('./login');
var logout = require('./logout');


module.exports = (app) => {

  app.use('/', home);
  app.use('/api', api);
  app.use('/map', map);
  app.use('/login', login);
  app.use('/logout', logout);

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
