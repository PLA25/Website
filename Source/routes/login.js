const app = require('express').Router();
const passport = require('passport');

app.post("/", passport.authenticate('local', {}), (req, res) => {
	if ('user' in req) {
		res.redirect('/map');
	} else {
		res.redirect('/login');
	}
});

app.get("/login", function(req, res) {
	if (!('user' in req)) {
		res.render('login');
	} else {
		res.redirect('/map');
	}
});

module.exports = app;