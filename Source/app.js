/* Packages */
const express = require('express');
const session = require('express-session');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const hbs = require('hbs');
const mongoose = require('mongoose');
const i18n = require('i18n');
const logger = require('morgan');

/* Requires the configuration, passport and routes. */
const config = require('./config/all');

const passport = require('./config/passport');
const routes = require('./routes');

/* Connects to the MongoDB database with the configured settings. */
mongoose.connect(`mongodb://${config.MongoDB.User}:${config.MongoDB.Pass}@${config.MongoDB.Host}:${config.MongoDB.Port}/${config.MongoDB.Name}`);
mongoose.Promise = Promise;

/* Configures i18n. */
i18n.configure({
  locales: ['en', 'nl'],
  defaultLocale: 'en',
  directory: path.resolve(__dirname, 'locales'),
  objectNotation: true,
  syncFiles: true,
});

/* Creates an application instance with Express. */
const app = express();
hbs.localsAsTemplateData(app);

/* Binds i18n to the Express app. */
app.use(i18n.init);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/* Sets a favicon for browsers. */
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

if (process.env.NODE_ENV !== 'testing') {
  app.use(logger('dev'));
}

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
  /* Stores the session as a cookie for 5 minutes. */
  cookie: {
    maxAge: (5 * 60 * 1000),
  },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/* Sets locale if there's a session with a locale. */
app.use((req, res, next) => {
  if (req.session.locale) {
    i18n.setLocale(req.session.locale);
  }

  next();
});

/* Changes the language on command. */
app.post('/locale-:locale', (req, res) => {
  req.session.locale = req.params.locale;
  res.redirect('back');
});

/* Binds i18n to Handlebars. */
hbs.registerHelper(
  'i18n',
  (str) => {
    if (!str) {
      return str;
    }

    // eslint-disable-next-line no-underscore-dangle
    return i18n.__(str);
  },
);

module.exports = routes(app, passport);
