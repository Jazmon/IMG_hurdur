import express from 'express';
import { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import graphqlHTTP from 'express-graphql';
const app = express();

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

console.log('Listening on 127.0.0.1:3000');
app.listen(3000);
