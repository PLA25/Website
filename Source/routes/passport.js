var passport = require('passport');
var authMethod = require('passport-local').Strategy;
var mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://admin:admin@ds111279.mlab.com:11279/pla25');
var connection;
var dbready = false;

db.then(conn => {
	connection = conn;
	dbready = true;
});

/**
 *
 * Hier kunnen de pagina's worden aangegeven die voor iedereen toegankelijk zijn.
 *
 */
var uitzonderingen = ["/"];

/**
 *
 * Dit wordt bij elke aanvraag gedaan.
 * Hier wordt gekeken of de gebruiker is aangemeld.
 *
 */
function authenticator(req, res, next) {
	var noParams = req.url.replace(/\?.*/, "");
	var isLoginPage = (noParams == "/login");
	var auth = req.isAuthenticated();
	//
	//Als de pagina onder de uitzonderingen valt
	if (uitzonderingen.includes(noParams)) {
		next();
	}
	//Als de gebruiker niet is aangemeld en zich niet op de login pagina bevindt
	else if (!isLoginPage && !auth) {
		res.redirect('/');
	}
	//Als de gebruiker op de login pagina is, maar al aangemeld is (verwijst naar /home)
	else if (isLoginPage && auth) {
		res.redirect('/home');
	}
	//Anders is alles goed en gaat het verder
	else {
		next();
	}
}

/**
 *
 * Dit is de methode voor passport.
 *
 */
passport.use(new authMethod({
	usernameField: 'username',
	passwordField: 'password',
	session: true
}, (un, pw, done) => {
	//un = username, pw = password
	if (!dbready) {
		return done(null, false);
	}
	connection.collection("users").findOne({"username": un, "password": pw}, (err, result) => {
		if (!err) {
			return done(null, result);
		} else {
			return done(null, false);
		}
	});
}));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

passport.authenticator = authenticator;

module.exports = passport;