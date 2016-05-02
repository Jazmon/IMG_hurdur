const path = require('path');
const multipart = require('connect-multiparty');
const utils = require('../utils');
const Image = require('../models/image');
const multipartMiddleware = multipart();

module.exports = (app, passport) => {

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

  app.get('/form', (req, res) => {
    res.render('uploadform', {

    });
  });
  app.post('/form', multipartMiddleware, (req, res) => {
    // TODO check types, image size, filename, csrf
    let filename = req.files.file.name;
    if (!utils.isFilenameImage(filename)) {
      return res.status(403)
        .json({
          success: false,
          message: 'invalid file'
        });
    }

    filename = utils.uniquefyImageFilename(filename);
    utils.moveFile(req.files.file.path, path.join(__dirname,
      '/mediaroot/uploads/' + filename), {
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

    utils.deleteRequestFiles(req);
    img.save();
    res.redirect('/form');
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

  app.use('/api', require('./api'));
  app.use('/auth', require('./auth')(passport));
};
