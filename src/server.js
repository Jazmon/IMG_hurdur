import path from 'path';
import express from 'express';
import multipart from 'connect-multiparty';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import jwt from 'jsonwebtoken';
import PrettyError from 'pretty-error';
import morgan from 'morgan';
import mongoose from 'mongoose';
import mv from 'mv';
import del from 'del';
import shortid from 'shortid';

import Comment from './models/comment';
import Hashtag from './models/hashtag';
import Image from './models/image';
import Like from './models/like';
import Mention from './models/mention';
import User from './models/user';
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
app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'mediaroot')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// ========================================================
// error handling
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

// ========================================================

router.route('/test')
  .get((req, res) => {
    res.json({
      hello: 'world!'
    });
  });

router.route('/hashtag')
  .get((req, res) => {
    Hashtag.find((err, hashtags) => {
      if (err) {
        res.send(err);
      }
      res.send(hashtags);
    });
  });

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
  console.log(`extension: '${extension}'`);
  console.log(`filename: '${filename}'`);
  filename = filename.substr(0, filename.length  - 1 - extension.length);
  console.log(`filename: '${filename}'`);
  filename += '_';
  filename += shortid.generate();
  console.log(`filename: '${filename}'`);
  filename += '.';
  filename += extension;
  console.log(`filename: '${filename}'`);
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

console.log('Server started!');
console.log(`Listening on ${ip}:${port}`);
app.listen(port);
