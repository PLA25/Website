const home = require('./home');
const admin = require('./admin');
const api = require('./api');
const map = require('./map');

module.exports = (app, passport) => {
  app.use((req, res, next) => {
    if (req.isAuthenticated()) {
      res.locals.user = req.user;
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

  app.use('/admin', admin);
  app.use('/api', api);
  app.use('/map', map);

  /** Error 404 handler. */
  app.use((req, res) => {
    res.status(404);
    res.render('404');
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
