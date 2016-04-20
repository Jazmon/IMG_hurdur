// Utils
import mv from 'mv';
import del from 'del';
import path from 'path';
import shortid from 'shortid';

// Express and express middleware
import express from 'express';
import multipart from 'connect-multiparty';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import PrettyError from 'pretty-error';
import morgan from 'morgan';
//import admin from 'sriracha-admin';
import favicon from 'serve-favicon';
//import expressDebug from 'express-debug';
import timeout from 'connect-timeout';
import compression from 'compression';

import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Models
import Comment from './models/comment';
import Hashtag from './models/hashtag';
import Image from './models/image';
import Like from './models/like';
import Mention from './models/mention';
import User from './models/user';
// Configs
import {
  port,
  auth,
  debug,
  ip,
} from './config';

// ========================================================
const app = express();
const router = express.Router();
const multipartMiddleware = multipart();
mongoose.connect(`mongodb://localhost/imghurdur`);

// ========================================================
// register server middleware
app.use(timeout('5s'));
app.use(morgan('combined'));
app.use(haltOnTimedout);
app.use(compression());
app.use(haltOnTimedout);
app.use(express.static(path.join(__dirname, 'public')));
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
//app.use('/admin', admin());
//app.use(haltOnTimedout);
//expressDebug(app, {});
//app.use(haltOnTimedout);

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


// ========================================================

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
      console.log('Deleted files and folders:\n',
        paths.join('\n'));
    });
  req.files = null;

  img.save();
  res.json(img);

});

function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}

console.log('Server started!');
console.log(`Listening on ${ip}:${port}`);
app.listen(port);
