/**
 * Home route
 *
 * @module routes/home
 * @see module:routes
 */

/* Packages */
const express = require('express');

/* Authentication */
const passport = require('./../config/passport');

/* Middleware */
const isLoggedIn = require('./../middleware/isLoggedIn');

/* Constants */
const router = express.Router();

router.get('/404', (req, res) => {
  res.status(404);
  res.render('404');
});

/**
 * Renders the login page.
 *
 * @name Login
 * @path {GET} /login
 * @code {200} if the request is sucesfull
 */
router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login',
    layout: 'layout-nonav',
    error: req.flash('error'),
  });
});

/**
 * Handles the POST-data to /login.
 *
 * @name Login
 * @path {POST} /login
 * @code {200} if the request is sucesfull
 */
router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
}));

/**
 * Renders the index page.
 *
 * @name Index
 * @path {GET} /
 * @code {200} if the request is sucesfull
 */
router.get('/', isLoggedIn, (req, res) => {
  res.render('index');
});

/**
 * Logs a user out and redirects him to the homepage.
 *
 * @name Logout
 * @path {GET} /logout
 * @code {200} if the request is sucesfull
 * @todo Redirect to /login instead to remove an extra redirection (/logout -> / -> /login).
 */
router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
