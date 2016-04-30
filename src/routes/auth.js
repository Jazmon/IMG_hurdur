const express = require('express');
const jwt = require('jsonwebtoken');
const { auth } = require('../config');

const router = express.Router();

module.exports = (passport) => {
  router.route('/signup')
    .post(passport.authenticate('local-signup', {
      session: false
    }),
    (req, res) => {
      res.json({success: true, user: req.user});
      res.end();
    });
  router.route('/login')
    .post(passport.authenticate('local-login', {
      session: false
    }),
    (req, res) => {
      const expiresIn = 60 * 60 * 24 * 180; // 180 days
      const token = jwt.sign(req.user, auth.jwt.secret, { expiresIn });
      res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true});
      res.send({success: true, token, expiresIn});
    });
  return router;
};
