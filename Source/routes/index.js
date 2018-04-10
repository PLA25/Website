/** Creates page instances from required routes. */
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

  /** Sets the home address as a passport home page. */
  app.use('/', home(passport));

  /** Displays the login page if user is not authenticated, continues if it is. */
  app.use((req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      /** Redirects to the login page. */
      res.redirect('/login');
    }
  });

  /** Sets addresses for each page instance. */
  app.use('/admin', admin);
  app.use('/api', api);
  app.use('/map', map);

  /** Throws the 404 error and renders its page. */
  app.use((req, res) => {
    res.status(404);
    
    /** Renders the 404 error page from its view. */
    res.render('404');
  });

  /** Handles all errors other than 404. */
  app.use((err, req, res) => {
    /** Sets locals, only providing error in development. */
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    /** Sets the appropriate error status, if it doesn't exist then set it as the 500 error, which is known for unspecificity. */
    res.status(err.status || 500);
    
    /** Renders the error page from its view. */
    res.render('error');
  });

  return app;
};
