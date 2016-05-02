const LocalStrategy = require('passport-local')
  .Strategy;
const User = require('./models/user');

function passportConfig(passport) {
  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // Used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
    (req, email, password, done) => {
      // asynchronous
      // User.findOne wont fire unless data is sent back
      process.nextTick(() => {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({
          'local.email': email
        }, (err, user) => {
          if (err) {
            return done(err);
          }

          if (user) {
            return done(null, false, req.flash('loginMessage',
              'That email is already taken.'));
          } else {
            // if there is no user with that email
            // create the user
            const newUser = new User();

            // set the user's local credentials
            newUser.local.email = email;
            newUser.local.password = newUser.generateHash(password);

            // save the user
            newUser.save((err) => {
              if (err) {
                throw err;
              } else {
                return done(null, newUser);
              }
            });
          }
        });
      });
    }
  ));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
    (req, email, password, done) => {
      User.findOne({
        'local.email': email
      }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, req.flash('loginMessage',
            'No user found.'));
        }
        if (!user.isValidPassword(password)) {
          return done(null, false, req.flash('loginMessage',
            'Oops! Wrong password!'));
        }
        return done(null, user);
      });
    }

  ));

}

module.exports = passportConfig;
