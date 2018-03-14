const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const auth = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const sleep = require('system-sleep');
const hbs = require('handlebars');
const fs = require('fs');
const path = require('path');
const logger = require('morgan');

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

app.use(logger('dev'));

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
	var user = false;
	connection.collection("users").findOne({"username": un, "password": pw}, function(err, result) {
		if (!err) {
			user = result;
		}
		ready = true;
	});
	while (!ready) {
		sleep(100);
	}
	return done(null, user);
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
 *
 */
const root = ({root:__dirname + "\\public"});

/**
 *
 * Hier worden /login, /logout, /map, /admin en /user aangemaakt
 *
 */
app.use(require('./routes/index'));

/**
 *
 * /user toevoegen
 *
 */
app.use(require('./routes/users'));

/**
 *
 * de statische map 'public'
 *
 */
app.use(express.static(path.join(__dirname, "/public")));

/**
 *
 * Alle overige pagina's verwijzen naar /login of het bestand opsturen als het gaat om css, js, etc.
 *
 */
app.get("*", function(req, res) {
	res.redirect('/login');
});

module.exports = app;