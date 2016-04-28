// Utils
const mv = require('mv');
const del = require('del');
const path = require('path');

const multipart = require('connect-multiparty');
const express = require('express');
const shortid = require('shortid');

const router = express.Router();
const multipartMiddleware = multipart();



// Models
//const Comment = require('./models/comment');
const Hashtag = require('../models/hashtag');
const Image = require('../models/image');
//const Like = require('./models/like');
//const Mention = require('./models/mention');
//const User = require('./models/user');

module.exports = (app, passport) => {
  //const routes = (app, passport) => {

  app.get('/', (req, res) => {
    res.render('home', {
      user: req.user
    });
  });

  app.get('/signin', (req, res) => {
    res.render('signin', {
      message: req.flash('loginMessage')
    });
  });

  /*app.get('/signup', (req, res) => {
    res.render('signup', {
      message: req.flash('signupMessage')
    });
  });*/

  /*const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  };*/

  /*app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', {
      user: req.user
    });
  });*/

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signin',
    failureFlash: true
  }));

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/signin',
    failureFlash: true
  }));

  router.route('/hashtag')
    .get((req, res) => {
      Hashtag.find((err, hashtags) => {
        if (err) {
          res.send(err);
        }
        res.send(hashtags);
      });
    });

  router.route('/image')
    .get((req, res) => {
      Image.find((err, images) => {
        if (err) {
          res.status(500)
            .send(err);
        } else {
          res.send(images);
        }
      });
    })
    .post();

  app.use('/api', router);

  app.post('/upload', multipartMiddleware, (req, res) => {
    // TODO check types, image size, filename, csrf
    let filename = req.files.file.name;
    if (!filename.match(/([a-zA-Z0-9\.\-\_]{1,20})(\.)(png|jp(e)?g|gif)$/)) {
      res.status(403)
        .json({
          success: false,
          message: 'invalid file'
        });
      return;
    }

    const extension = filename.split(/(png|jp(e)?g|gif)$/)[1];
    filename =
      `${filename.substr(0, filename.length  - 1 - extension.length)}` +
      `_${shortid.generate()}.${extension}`;

    mv(req.files.file.path,
      path.join(__dirname, '/mediaroot/uploads/' + filename), {
        mkdirp: true
      }, (err) => {
        if (err) {
          res.send(err);
        }
      });

    let img = new Image({
      title: 'Cool pic',
      description: 'Foo bar baz',
      uploadPath: filename
    });

    del([req.files.file.path])
      .then(paths => {
        /* eslint-disable no-console */
        console.log('Deleted files and folders:\n',
          paths.join('\n'));
        /* eslint-enable no-console */
      });
    delete req.files;
    req.files = null;

    img.save();
    res.json(img);

  });
};

// default routes;
