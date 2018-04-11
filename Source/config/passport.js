/* Packages */
const Passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

/* Models */
const User = require('./../models/user');

/* Serializes the user. */
Passport.serializeUser((user, done) => {
  done(null, user.id);
});

/* Deserializes the user. */
Passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/* Handles authentication. */
const LocalLogin = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
}, (req, email, password, done) => {
  User.findOne({
    /* Forces email address to lower case for consistency. */
    email: email.toLowerCase(),
  }, (err, user) => {
    /* Finishes this block if an error occures. */
    if (err) {
      return done(err);
    }

    /* If there isn't a user with the entered username, flash this error message. */
    if (!user) {
      return done(null, false, req.flash('error', 'No user found.'));
    }

    /* If the password doesn't match the entered username, flash this error message. */
    if (!user.validatePassword(password)) {
      return done(null, false, req.flash('error', 'Oops! Wrong password.'));
    }

    /* Finishes this block if no error occures. */
    return done(null, user);
  });
});

/* Sets the authentication handler for Passport usage. */
Passport.use('local-login', LocalLogin);

module.exports = Passport;
