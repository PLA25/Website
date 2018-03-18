var express = require('express');
var router = express.Router();

module.exports = (passport) => {
  router.get('/', (req, res) => {
    res.render('index', {});
  });

  router.get('/login', (req, res) => {
    res.render('login', {
      title: "Login",
      layout: false
    });
  });

  router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));

  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  return router;
};
