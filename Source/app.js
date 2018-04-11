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
 * @todo Create a feature to switch languages on command.
 * @todo Save the current language as a cookie.
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

/** Binds i18n to Handlebars. */
hbs.registerHelper('i18n',
  function (str) {
    if(!str) {
      return str;
    }

    return i18n.__(str);
  }
);

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

module.exports = routes(app, passport);
