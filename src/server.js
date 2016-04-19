// import express from 'express';
// import { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
// import graphqlHTTP from 'express-graphql';

import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import expressGraphQL from 'express-graphql';
import jwt from 'jsonwebtoken';
import PrettyError from 'pretty-error';
import models from './data/models';
import schema from './data/schema';
import routes from './routes';
import assets from './assets';
import {
  port, auth, debug,
} from './config';

const app = express();

// register server middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// authentication
app.use(expressJwt({
  secret: auth.jwt.secret,
  credentialsRequired: false,
  getToken: req => req.cookies.id_token,
}));


// register API middleware
app.use('/graphql', expressGraphQL(req => ({
  schema,
  graphiql: true,
  rootValue: { request: req },
  pretty: debug,
})));


// error handling
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => {
  console.log(pe.render(err));
  const template = require('./views/error.jade');
  const statusCode = err.status || 500;
  res.status(statusCode);
  res.send(template({
    message: err.message,
    stack: debug ? err.stack : '',
  }));
});

// launch server
models.sync().catch(err => console.error(err.stack)).then(() => {
  app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}/`);
  })
});


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

app.get('/', (req, res) => {
  res.json({hello: 'world!'});
});

console.log('Server started!');
console.log(`Listening on ${IP}:${PORT}`);
app.listen(PORT);
