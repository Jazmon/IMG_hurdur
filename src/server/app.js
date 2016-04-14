import express from 'express';
import { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import graphqlHTTP from 'express-graphql';
const app = express();

const PORT = process.env.PORT || 8000;
const IP = process.env.IP || 'localhost';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'world';
        }
      }
    }
  })
});

app.use('/graphql', graphqlHTTP({schema: schema, graphiql: true, rootValue: schema}));

app.get('/', (req, res) => {
  res.json({hello: 'world!'});
});

console.log('Server started!');
console.log(`Listening on ${IP}:${PORT}`);
app.listen(PORT);
