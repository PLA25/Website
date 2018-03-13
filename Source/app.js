const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const auth = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const path = require('path');
const sleep = require('system-sleep');
const hbs = require('handlebars');

const mongoose = require('mongoose');
mongoose.set('debug', true);
const db = mongoose.createConnection('mongodb://admin:admin@ds111279.mlab.com:11279/pla25');

var dbready = false;
var connection = null;

db.then(function(conn) {
	connection = conn;
	dbready = true;
});

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname + '/views'));

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
	if (!dbready) {
		return done(null, false);
	}
	var ready = false;
	var users = [];
	db.collection("users").find({}).toArray(function(err, array) {
		if (err) {
			console.log("\n::: ERROR :::\n");
			throw err;
		} else {
			users = array;
			ready = true;
		}
	});
	while (!ready) {
		sleep(100);
	}
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
app.use(require('./routes/index'));

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

app.listen(80, "localhost");