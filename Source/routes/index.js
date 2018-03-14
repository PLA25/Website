const app = require('express').Router();

const passport = require('passport');

const check = function(req, res, next) {
	if ('user' in req) {
		next();
	} else {
		res.redirect('/login');
	}
};

app.get("/admin", check, function(req, res) {
	if (req.user.role == 'admin') {
		res.render('admin', {});
	} else {
		res.redirect('/map');
	}
});

app.post("/", passport.authenticate('local', {}), (req, res) => {
	if (req.isAuthenticated()) {
		res.redirect('/map');
	} else {
		res.redirect('/login');
	}
});

app.get("/login", function(req, res) {
	if (!req.isAuthenticated()) {
		res.render('login');
	} else {
		res.redirect('/map');
	}
});

app.get("/map", check, function(req, res) {
	res.render('map');
});

app.get('/user', check, function(req, res) {
	res.setHeader("Content-Type", "text/json; charset=UTF-8");
	res.send(JSON.stringify(req.user));
});

app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/login');
});

app.get("/", function(req, res) {
	res.redirect("/map");
});

module.exports = app;