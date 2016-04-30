const express = require('express');
const { auth } = require('../config');
const expressJwt = require('express-jwt');
const router = express.Router();

const getToken = (req) => {
  if(req.headers.authorization &&
      req.headers.authorization.split(' ')[0] == 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  } else if(req.body && req.body.token) {
    return req.body.token;
  }
  return null;
};

router.use(expressJwt({
  secret: auth.jwt.secret,
  credentialsRequired: false,
  getToken: getToken
}), (req, res, next) => {
  if(!req.user ) {
    res.status(403).send({
      success: false,
      message: 'Unauthorized.'
    });
  } else {
    next();
  }
});

//
// Models
// ==============================================
const Hashtag = require('../models/hashtag');
const Image = require('../models/image');
//const Like = require('./models/like');
//const Mention = require('./models/mention');
//const User = require('./models/user');
//const Comment = require('./models/comment');


router.route('/')
  .get((req, res) => {
    res.json({hello: 'world!'});
  });

router.route('/me')
  .get((req, res) => {
    res.status(200).json({foo: 'bar', user: req.user || 'baz'});
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

module.exports = router;
