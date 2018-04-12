const express = require('express');
const session = require('express-session');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const hbs = require('hbs');
const mongoose = require('mongoose');
const i18n = require('i18n');

const config = require('./config');
const passport = require('./config/passport');
const routes = require('./routes');

mongoose.connect(`mongodb://${config.MongoDB.User}:${config.MongoDB.Pass}@${config.MongoDB.Host}:${config.MongoDB.Port}/${config.MongoDB.Name}`);
mongoose.Promise = Promise;

/**
 * Configures i18n.
 */
i18n.configure({
  locales: ['en', 'nl'],
  defaultLocale: 'en',
  directory: __dirname + '/locales',
  objectNotation: true,
  syncFiles: true,
});

const app = express();
hbs.localsAsTemplateData(app);

/** Binds i18n to the Express app. */
app.use(i18n.init);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'PolutionDetectionSystem',
  secure: false,
  HttpOnly: true,
  rolling: true,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: (5 * 60 * 1000),
  },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/** Sets locale if there's a session with a locale. */
app.use(function (req, res, next) {
  if (req.session.locale) {
    i18n.setLocale(req.session.locale);
  }

  next();
});

/** Changes the language on command. */
app.post('/locale-:locale', (req, res) => {
  req.session.locale = req.params.locale;
  res.redirect('back');
});

/** Binds i18n to Handlebars. */
hbs.registerHelper('i18n',
  function (str) {
    if(!str) {
      return str;
    }

    return i18n.__(str);
  }
);

module.exports = routes(app, passport);
