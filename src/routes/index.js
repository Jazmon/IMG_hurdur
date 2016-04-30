// Utils
const mv = require('mv');
const del = require('del');
const path = require('path');
const { auth } = require('../config');
const expressJwt = require('express-jwt');

const multipart = require('connect-multiparty');
const shortid = require('shortid');

const multipartMiddleware = multipart();

const Image = require('../models/image');

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

  // ayyyyy lmao
  const apiRoutes = require('./api')();
  app.use('/api', apiRoutes);

  app.use('/auth', require('./auth')(passport));
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
