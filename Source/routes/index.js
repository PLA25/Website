const home = require('./home');
const api = require('./api');
const map = require('./map');
boolean isAdmin = true;

module.exports = (app, passport) => {
  app.use((req, res, next) => {
    if (req.isAuthenticated()) {
      res.locals.user = req.user;

	  res.locals.user.isAdmin = req.user.isAdmin;
    }

    next();
  });

  app.use('/', home(passport));

  app.use((req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/login');
    }
  });

  app.use('/api', api);
  app.use('/map', map);

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler
  app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  return app;
};
