/* Packages */
const express = require('express');
const session = require('express-session');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const hbs = require('hbs');
const i18n = require('i18n');
const logger = require('morgan');

const controllers = require('./controllersfts');

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
app.use(favicon(path.join(__dirname, 'public', 'logo.png')));

if (process.env.NODE_ENV !== 'testing') {
  logger.token('worker', () => process.pid);
  app.use(logger(':worker :method :url :status :response-time ms - :res[content-length]'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'PollutionDetectionSystem',
  secure: false,
  HttpOnly: true,
  rolling: true,
  resave: true,
  saveUninitialized: true,
  /* Stores the session as a cookie for 120 minutes. */
  cookie: {
    maxAge: (120 * 60 * 1000),
  },
}));
app.use(flash());

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

app.use(controllers);

module.exports = app;
