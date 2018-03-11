const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require("path");

const app = express();

/**
 *
 * un = username
 * pw = password
 *
 */
function getUsers() {
	//haal de gebruikers uit de db, geeft nu dummy data
	return [
		{name: "Sjaak", role: "admin", un: "sjaak", pw: "123"},
		{name: "Kees", role: "user", un: "kees", pw: "123"}
	];
}

/**
 *
 * req = request
 * res = response
 *
 */

//Options: https://github.com/expressjs/session#options
app.use(session({
	secret: "gsg4w5wsgvxxb^%&fdh",
	resave: true,
	saveUninitialized: false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const root = ({root:__dirname + "\\main"});

app.get("/login", function(req, res) {
	if (typeof req.session.user == "undefined") {
		res.sendFile("./login.html", root);
	} else {
		res.redirect("/map");
	}
});

app.post("/login", function(req, res) {
	var users = getUsers();
	for (var i = 0; i < users.length; i++) {
		if (users[i].un == req.body.un && users[i].pw == req.body.pw) {
			req.session.user = users[i];
			req.session.access = true;
			break;
		}
	}
	res.redirect("/map");
});

app.get("/logout", function(req, res) {
	delete(req.session.user);
	req.session.access = false;
	res.redirect("/login");
});

app.get("/user", function(req, res) {
	res.setHeader("Content-Type", "text/json; charset=UTF-8");
	var string = JSON.stringify(req.session.user);
	res.send((typeof string == "string") ? string : "{\"name\":null, \"role\":null, \"un\":null, \"pw\": null}");
});

app.get("/", function(req, res) {
	res.redirect("/map");
});

app.get("/map", function(req, res) {
	if (req.session.access) {
		res.sendFile("./map.html", root);
	} else {
		res.redirect("/login");
	}
});

app.get("/admin", function(req, res) {
	if (req.session.access && req.session.user.role == "admin") {
		res.sendFile("./admin.html", root);
	} else {
		res.redirect("/map");
	}
});

app.get("*", function(req, res) {
	res.redirect("/login");
});

app.listen(2000, "localhost");