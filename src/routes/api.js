
const express = require('express');
const jwt = require('jsonwebtoken');
const { auth } = require('../config');
const expressJwt = require('express-jwt');

const router = express.Router();
/*
const authenticate = expressJwt({
  secret: auth.jwt.secret,
  credentialsRequired: false,
  getToken: req => req.cookies.id_token
});*/

router.use((req, res, next) => {
  const token = req.body.token || req.query.token
      || req.headers['x-access-token'];
  if(token) {
    jwt.verify(token, auth.jwt.secret, (err, decoded) => {
      if(err) {
        return res.json({success: false, message: 'failed to authenticate token.'});
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'no token provided.'
    });
  }
});
/*expressJwt({
  secret: auth.jwt.secret,
  credentialsRequired: false,
  getToken: req => req.cookies.id_token
})*/
//
// Models
// ==============================================
const Hashtag = require('../models/hashtag');
const Image = require('../models/image');
//const Like = require('./models/like');
//const Mention = require('./models/mention');
//const User = require('./models/user');
//const Comment = require('./models/comment');

module.exports = () => {

  router.route('/')
    .get((req, res) => {
      res.json({hello: 'world!'});
    });

  router.route('/me')
    .get((req, res) => {
      res.status(200).json({foo: 'bar', user: req.user || 'baz'});
    });



  /*router.route('/signup', passport.authenticate('local-signup', {
    session: false
  }),
  (req, res) => {
    res.json({success: true, user: req.user});
    res.end();
  });

  router.route('/login', passport.authenticate('local-login', {
    session: false
  }),
  (req, res) => {
    const expiresIn = 60 * 60 * 24 * 180; // 180 days
    const token = jwt.sign(req.user, auth.jwt.secret, { expiresIn });
    res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true});
    res.send({success: true, token, expiresIn});
  });*/

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
  return router;
};
