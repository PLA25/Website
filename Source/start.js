const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const auth = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

/**
 *
 * Hier worden de gebruikers uit de db gehaald
 *
 */
function getUsers() {
	//haal de gebruikers uit de db, geeft nu dummy data
	return [
		{name: "Sjaak", role: "admin", username: "sjaak", password: "123"},
		{name: "Kees", role: "user", username: "kees", password: "123"}
	];
}

/**
 *
 * Hier worden alle APIs aan express toegevoegd
 *
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

app.use(session({
	secret: 'anfalf4gd(FNvT^^',
	resave: true,
	saveUninitialized: false
}));

passport.use(new auth({
	usernameField: 'username',
	passwordField: 'password',
	session: true
}, (un, pw, done) => {
	var users = getUsers();
	for (var i = 0; i < users.length; i++) {
		if (users[i].username == un && users[i].password == pw) {
			return done(null, users[i]);
		}
	}
	return done(null, false);
}));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

/**
 *
 * Deze constanten worden gebruikt voor:
 *  • root: om het pad naar de map aan te geven
 *  • check: om te kijken of de gebruiker is aangemeld
 *
 */
const root = ({root:__dirname + "\\public"});
const check = function(req, res, next) {
	if ('user' in req) {
		next();
	} else {
		res.redirect('/login');
	}
};

/**
 *
 * Hier worden /login, /logout, /map, /admin en /user aangemaakt
 *
 */

/**
 *
 * De aanmeldpagina
 *
 */
app.get("/login", function(req, res) {
	if (!('user' in req)) {
		res.sendFile("./login.html", root);
	} else {
		res.redirect('/map');
	}
});

/**
 *
 * Een verwijzing naar /map als de aanvraag "/" is
 *
 */
app.get("/", function(req, res) {
	res.redirect("/map");
});

/**
 *
 * De /map pagina
 *
 */
app.get("/map", check, function(req, res) {
	res.sendFile("./map.html", root);
});

/**
 *
 * De /admin pagina
 *
 */
app.get("/admin", check, function(req, res) {
	if (req.user.role == 'admin') {
		res.sendFile("./admin.html", root);
	} else {
		res.redirect('/map');
	}
});

/**
 *
 * De /logout pagina, verwijst door naar /login
 *
 */
app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/login');
});

/**
 *
 * De /user pagina, voor het ophalen van de gebruikersgegevens
 *
 */
app.get('/user', check, function(req, res) {
	res.setHeader("Content-Type", "text/json; charset=UTF-8");
	res.send(JSON.stringify(req.user));
});

/**
 *
 * Alle overige pagina's verwijzen naar /login of het bestand opsturen als het gaat om css, js, etc.
 *
 */
app.get("*", function(req, res) {
	if (path.extname(req.url) == "") {
		res.redirect("/login");
	} else {
		res.sendFile("." + req.url, root);
	}
});

/**
 *
 * Hier wordt de data van het aanmeldscherm naar gestuurd om aan te melden
 *
 */
app.post("/", passport.authenticate('local', {}), (req, res) => {
	if ('user' in req) {
		res.redirect('/map');
	} else {
		res.redirect('/login');
	}
});

app.listen(80, "localhost");