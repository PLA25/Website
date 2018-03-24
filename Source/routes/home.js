const express = require('express');

const router = express.Router();

module.exports = (passport) => {
  router.get('/login', (req, res) => {
    res.render('login', {
      title: 'Login',
      layout: false,
    });
  });

  router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  }));

  router.use((req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/login');
    }
  });

  router.get('/', (req, res) => {
    res.render('index', {title: "Home", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."});
  });

  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  return router;
};
