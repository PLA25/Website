const express = require('express');

const router = express.Router();

module.exports = (passport) => {
  router.get('/login', (req, res) => {
    res.render('login', {
      title: 'Login',
      layout: 'layout-nonav',
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
    res.render('index', {});
  });

  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  return router;
};
