var express = require('express');
var passport = require("../models/passport");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index', {});
});

/* GET login page. */
router.get('/', (req, res) => {
	res.render('login', {title: "Login", layout: false});
});

/* POST login page */
router.post('/', passport.authenticate('local', {failureRedirect: "/login"}), (req, res) => {
	res.redirect('/home');
});

/* GET logout page */
router.get('/', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;
