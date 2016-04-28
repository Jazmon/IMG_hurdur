// Utils
//const mv = require('mv');
//const del = require('del');
const path = require('path');

// Express and express middleware
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
//const expressJwt = require('express-jwt');
const PrettyError = require('pretty-error');
const logger = require('morgan');
const favicon = require('serve-favicon');
const timeout = require('connect-timeout');
const flash = require('connect-flash');
const compression = require('compression');
const exphbs = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
//const LocalStrategy = require('passport-local');
//const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


const {
  port,
  //debug,
  ip
} = require('./config');
/*
passport.use(new LocalStrategy(
  (username, password, done) => {
    User.findOne({ username:username }, (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.'});
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.'});
      }
      return done(null, user);
    });
  }
));
*/
//import auth from './auth';

// ========================================================
// passport shiet
/*passport.use('local-signin', new LocalStrategy({
    passReqToCallback: true
  },
  (req, username, password, done) => {
    auth.localAuthentication(username, password)
      .then((user) => {
        if (user) {
          console.log(`LOGGED IN AS: ${user.username}`);
          req.session.success =
            `You are succesfully logged in ${user.username}!`;
          done(null, user);
        }
        if (!user) {
          console.log('COULD NOT LOG IN');
          req.session.error = 'Could not log user in. Please try again.';
          done(null, user);
        }
      })
      .fail((err) => {
        console.log(err.body);
      });
  }
))
passport.use('local-signup', new LocalStrategy({
    passReqToCallback: true
  },
  (req, username, password, done) => {
    auth.localRegister(username, password)
      .then((user) => {
        if (user) {
          console.log(`REGISTERED: ${user.username}`);
          req.session.success =
            `You are successfully registered and logged in ${user.username}!`;
          done(null, user);
        }
        if (!user) {
          console.log('COULD NOT REGISTER');
          req.session.error =
            'That username is already in use, please try a different one.';
          done(null, user);
        }
      })
      .fail((err) => {
        console.log(err.body);
      })
  }
));
passport.serializeUser((user, done) => {
  console.log(`serializing ${user.username}`);
  done(null, user);
})
passport.deserializeUser((obj, done) => {
  console.log(`deserializing ${user.username}`);
  done(null, obj);
});*/

// Simple route middleware to ensure user is authenticated.
/*function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  req.session.error = 'Please sign in!';
  res.redirect('/signin');
}*/

// ========================================================
const app = express();
mongoose.connect('mongodb://localhost/imghurdur');

// ========================================================
// register server middleware
app.use(timeout('5s'));
app.use(logger('combined'));
app.use(haltOnTimedout);
app.use(compression());
app.use(haltOnTimedout);
app.use(express.static(path.join(__dirname, 'public')));
// TODO remove this, files should be returned somehow else?
app.use(express.static(path.join(__dirname, 'mediaroot')));
app.use(cookieParser());
app.use(haltOnTimedout);
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

const passportConfig = require('./passport');
passportConfig(passport);

const viewsDir = path.join(__dirname, '/views');
const hbs = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: path.join(viewsDir, '/layouts')
});
app.set('views', viewsDir);
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// session-persisted message middleware
/*app.use((req, res, next) => {
  const {
    err,
    msg,
    success
  } = req.session;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) {
    res.locals.error = err;
  }
  if (msg) {
    res.locals.notice = msg;
  }
  if (success) {
    res.locals.succes = success;
  }

  next();
});*/


// ========================================================
// error handling
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');
pe.start();


// Set to print output html from jade prettily
// https://stackoverflow.com/a/11812841
if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

// Error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

require('./routes/index')(app, passport);


function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}
/* eslint-disable no-console */
console.log(`
  Server started!
  Listening on ${ip}:${port}`);
/* eslint-enable no-console */
app.listen(port);
