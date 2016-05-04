const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const PrettyError = require('pretty-error');
const logger = require('morgan');
const favicon = require('serve-favicon');
const timeout = require('connect-timeout');
const flash = require('connect-flash');
const compression = require('compression');
const exphbs = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');

const {
  port,
  ip,
} = require('./config');

function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}

//
// Create the app
// ========================================================
const app = express();
mongoose.connect('mongodb://localhost/imghurdur');

const viewsDir = path.join(__dirname, '/views');
const hbs = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: path.join(viewsDir, '/layouts')
});
app.set('views', viewsDir);
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//
// Register server middleware
// ========================================================
app.use(timeout('5s'));
app.use(cookieParser());
app.use(haltOnTimedout);
app.use(logger('combined'));
app.use(haltOnTimedout);
app.use(compression());
app.use(haltOnTimedout);
app.use(express.static(path.join(__dirname, 'public')));
// TODO remove this, files should be returned somehow else?
app.use(express.static(path.join(__dirname, 'mediaroot')));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(haltOnTimedout);
app.use(bodyParser.json());
app.use(haltOnTimedout);
app.use(favicon(path.join(__dirname, '/public/favicon.ico')));
app.use(haltOnTimedout);
app.use(session({
  secret: 'supernova',
  saveUninitialized: true,
  resave: true
}));
app.use(haltOnTimedout);
app.use(passport.initialize());
app.use(haltOnTimedout);
app.use(passport.session());
app.use(haltOnTimedout);
app.use(flash());
app.use(haltOnTimedout);

//
// Authentication
// ========================================================
require('./passport')(passport);

//
// Error handling
// ========================================================
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');
pe.start();


// Set to print output html from jade prettily https://stackoverflow.com/a/11812841
/*if (app.get('env') === 'development') {
  app.locals.pretty = true;
}*/

// Development error handler, will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler, no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

require('./routes/index')(app, passport);

/* eslint-disable no-console */
console.log(`
  Server started!
  Listening on ${ip}:${port}`);
/* eslint-enable no-console */
app.listen(port);
