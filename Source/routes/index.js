/**
 * Routes
 * @module routes
 * @see module:routes/admin
 * @see module:routes/api
 * @see module:routes/home
 * @see module:routes/map
 */

/* Routes */
const home = require('./home');
const admin = require('./admin');
const api = require('./api');
const map = require('./map');

/* Middleware */
const {
  errorHandler, isLoggedIn, setUser, pageNotFoundHandler,
} = require('./../middleware');

module.exports = (app) => {
  app.use(setUser);
  app.use('/api', api);
  app.use('/', home);

  /* Only allow authenticated user */
  app.use(isLoggedIn);

  /* Sets addresses for each page instance. */
  app.use('/admin', admin);

  app.use('/map', map);

  /* Handlers */
  app.use(pageNotFoundHandler);
  app.use(errorHandler);

  /* Returns the application instance. */
  return app;
};
