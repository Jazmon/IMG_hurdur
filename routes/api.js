const path = require('path');
const multipart = require('connect-multiparty');
const expressJwt = require('express-jwt');
const express = require('express');

const {
  auth
} = require('../config');
const utils = require('../utils');
const router = express.Router();
const multipartMiddleware = multipart();

//
// Models
// ==============================================
const models = require('../models');
//const Hashtag = require('../models/hashtag');
//const Image = require('../models/image');
//const Like = require('../models/like');
//const Mention = require('../models/mention');
//const User = require('../models/user');
//const Comment = require('../models/comment');

const getToken = (req) => {
  if (req.headers.authorization &&
    req.headers.authorization.split(' ')[0] == 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  } else if (req.body && req.body.token) {
    return req.body.token;
  }
  return null;
};

router.use(expressJwt({
  secret: auth.jwt.secret,
  credentialsRequired: false,
  getToken: getToken
}), (req, res, next) => {
  if (!req.user) {
    /*res.status(403)
      .send({
        success: false,
        message: 'Unauthorized.'
      });*/
    next();
  } else {
    next();
  }
});

router.get('/', (req, res) => {
  models.User.findAll({
    include: [models.Comment, models.Image, models.User]
  }).then((users) => {
    res.send(users);
  });
});
// Route for user profiles
/*router.route('/user/:id([a-zA-Z0-9\-]+)')
  .get((req, res) => {
    User.findOne(utils.makeOIdQuery(req.params.id),
      'following followers comments images', (err, user) => {
        if (err) {
          res.send(err);
        } else {
          res.json(user);
        }
      });
  });
router.route('/me')
  .get((req, res) => {
    res.status(200)
      .json({
        user: req.user || 'baz'
      });
  });
router.route('/hashtags')
  .get((req, res) => {
    Hashtag.find((err, hashtags) => {
      if ( err) {
        res.send(err);
      }
      else {
        res.send(hashtags);
      }
    });
  })
  .post((req, res) => {
    const {hashtag} = req.body;
    if(!hashtag || !hashtag.match(/([\.\-\\\/\:\ \?\@\,\;\&\%\$\€\<\>\"\'\`\´\¨\~\(\)\{\}\[\]\^\|\*\+\-])\w+/)) {
      return res.status(400).send({error: 'invalid hashtag'});
    }

    Hashtag.findOne({text: hashtag}, (err, hashtag) => {
      if(err) {
        return res.send(err);
      }
      if(hashtag) {
        return res.send({error: 'the hashtag already exists'});
      }
      const newHashtag = new Hashtag({
        text: hashtag
      });
      newHashtag.save();
      return res.send(newHashtag);
    });
  });
router.route('/images')
  .get((req, res) => {

  })
  .post((req, res) => {
    Image.create({
      uploadPath: '',
      title: '',
      description: '',
    })
  });
router.route('/images/:id');
router.route('/images/:id/comments');
router.route('/images/:id/comments');
router.route('/images/:id/likes');
router.route('/users/:id/images');
router.route('/users/:id/images/:id');
router.route('/hashtag')
  .get((req, res) => {
    Hashtag.find((err, hashtags) => {
      if (err) {
        res.send(err);
      }
      res.send(hashtags);
    });
  });
router.route('/hashtag/:tag')
  .get((req, res) => {
    // if query with a hashtag, return images tagged with it
    Hashtag.findOne({text: req.params.tag}, (err, hashtag) => {
      if(err) {
        res.send(err);
      } else {
        // we got hashtag, get all images that contain it
        //Image.find()
        res.send('foo');
      }
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
router.route('/image/:id([a-zA-Z0-9\-]+)')
  .get((req, res) => {
    Image.findOne(utils.makeOIdQuery(req.params.id), 'title description comments hashtags uploadPath mentions likes created', (err, image) => {
      if (err) {
        res.send(err);
      } else {
        res.json(image);
      }
    });
  });
router.route('/image/:id([a-zA-Z0-9\-]+)/comment')
  .post((req, res) => {
    Image.findOne(utils.makeOIdQuery(req.params.id), (err, image) => {
      if(err) {
        res.send(err);
      } else {
        const comment = new Comment({
          commenter: req.user,
          text: req.body.text
        }).save();
        image.comments.push(comment);
        image.save();
      }
    });
  });
router.route('/upload')
  .post(multipartMiddleware, (req, res) => {
    // TODO check image types, image size, filename, csrf
    // maybe some kind of token auth here as well so we can have actual
    // trust between the client & server.
    let filename = req.files.file.name;
    if (!utils.isFilenameImage(filename)) {
      return res.status(403)
        .json({
          success: false,
          message: 'invalid file'
        });
    }

    filename = utils.uniquefyImageFilename(filename);
    utils.moveFile(req.files.file.path, path.join(__dirname, '..',
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
    res.json(img);
  });*/

module.exports = router;
