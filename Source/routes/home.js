/** Requires the Express module for routing. */
const express = require('express');

/** Creates router instance for this route. */
const router = express.Router();

/**
 * Displays the home, login & logout page contents.
 * @returns {Router} router - The router.
 */
module.exports = (passport) => {
  /** Gets the login page. */
  router.get('/login', (req, res) => {
    res.render('login', {
      title: 'Login',
      layout: 'layout-nonav',
      /** Flashes error messages on the login page. */
      error: req.flash('error'),
    });
  });

  /** Decides what to do with login success and failure. */
  router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    /** Allows error messages to be flashed on the login page. */
    failureFlash: true,
  }));

  /** If the user is not authenticated, load the login screen. */
  router.use((req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/login');
    }
  });

  /** Handles the default page. */
  router.get('/', (req, res) => {
    /** Renders the view 'index'. */
    res.render('index', {});
  });

  /**
   * Logs a user out and redirects him to the homepage.
   * @todo Redirect to /login instead to remove an extra redirection (/logout -> / -> /login).
   */
  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  /** Returns the router instance. */
  return router;
};
