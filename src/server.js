import path from 'path';
import express from 'express';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import jwt from 'jsonwebtoken';
import PrettyError from 'pretty-error';
import morgan from 'morgan';
import mongoose from 'mongoose';

import Comment from './models/comment';
import Hashtag from './models/hashtag';
import Image from './models/image';
import Like from './models/like';
import Mention from './models/mention';
import User from './models/user';

/*let hashtag = new Hashtag({
  text: 'helloworld'
});
hashtag.save();*/


import { port, auth, debug, ip, } from './config';
const app = express();

mongoose.connect(`mongodb://localhost/imghurdur`);

// register server middleware
app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
// error handling
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

/*app.use((err, req, res, next) => {
  console.log(pe.render(err));
  const template = require('./views/error.jade');
  const statusCode = err.status || 500;
  res.status(statusCode);
  res.send(template({
    message: err.message,
    stack: debug ? err.stack : '',
  }));
});*/

const router = express.Router();

router.route('/test')
  .get((req, res) => {
    res.json({hello: 'world!'});
  });

router.route('/hashtag')
  .get((req, res) => {
    Hashtag.find((err, hashtags) => {
      if (err) { res.send(err); }
      res.send(hashtags);
    });
  });
app.use('/api', router);

app.post('/upload', (req, res) => {
  let file;
  if (!req.files) {
    res.send('no files were uploaded');
    return;
  }
  file = req.files.file;
  file.mv(path.join(__dirname, '/mediaroot/uploads'), (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send('file uploaded!');
    }
  })
});

/*app.get('/test', (req, res) => {
  res.render(``);
})*/

console.log('Server started!');
console.log(`Listening on ${ip}:${port}`);
app.listen(port);

// authentication
/*app.use(expressJwt({
  secret: auth.jwt.secret,
  credentialsRequired: false,
  getToken: req => req.cookies.id_token,
}));*/

// register API middleware
/*app.use('/graphql', expressGraphQL(req => ({
  schema,
  graphiql: true,
  rootValue: { request: req },
  pretty: debug,
})));*/



// launch server
/*models.sync().catch(err => console.error(err.stack)).then(() => {
  app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}/`);
  })
});*/

//
// const PORT = process.env.PORT || 8000;
// const IP = process.env.IP || 'localhost';
// const DEBUG = process.env.NODE_ENV !== 'production';

// const schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: 'RootQueryType',
//     fields: {
//       hello: {
//         type: GraphQLString,
//         resolve() {
//           return 'world';
//         }
//       }
//     }
//   })
// });
//
// const apiRouter = new express.Router();
//
// apiRouter.get('/', (req, res) => {
//   res.send('welcome to api!');
// });
//
// app.use('/api', apiRouter);
//
// app.use('/graphql', graphqlHTTP({
//   schema: schema,
//   graphiql: DEBUG
// }));

/*app.get('/', (req, res) => {
  res.json({hello: 'world!'});
});*/
