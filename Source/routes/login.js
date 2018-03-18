var express = require('express');
var bodyParser = require('body-parser');
var passport = require('./passport');
var router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

/* GET login page. */
router.get('/', (req, res) => {
  res.render('login', {
    title: "Login"
  });
});

/* POST login page */
router.post('/', passport.authenticate('local', {
  failureRedirect: "/login"
}), (req, res) => {
  res.redirect('/home');
});

module.exports = router;
