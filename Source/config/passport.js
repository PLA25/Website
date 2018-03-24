const Passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./../models/user');

Passport.serializeUser((user, done) => {
  done(null, user.id);
});

Passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

const LocalLogin = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
}, (req, email, password, done) => {
  User.findOne({
	email: email.toLowerCase(),
  }, (err, user) => {
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false, req.flash('msg', 'Geen gebruiker gevonden.'));
    }

    if (!user.validPassword(password)) {
      return done(null, false, req.flash('msg', 'Oops! Verkeerd wachtwoord.'));
    }

    return done(null, user);
  });
});

Passport.use('local-login', LocalLogin);

module.exports = Passport;
