/* Packages */
const express = require('express');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const Redis = require('connect-redis')(session);
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const hbs = require('hbs');
const mongoose = require('mongoose');
const i18n = require('i18n');
const logger = require('morgan');

const config = require('./config/all');
const passport = require('./config/passport');
const controllers = require('./controllers');

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

/* Integrates file uploading in the app. */
app.use(fileUpload());

/* Executes this when uploading a logo. */
app.post('/upload', (req, res) => {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  /* The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file. */
  const { sampleFile: sampleFile } = req.files;

  /* Uses the mv() method to save this file. */
  sampleFile.mv(`${__dirname}/uploads/Naamloos.png`, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.send('File uploaded!');

    return false;
  });

  return false;
});

app.use(session({
  store: new Redis(config.Redis),
  secret: 'PollutionDetectionSystem',
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
