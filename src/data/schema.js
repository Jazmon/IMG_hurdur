import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import me from './queries/me';
import image from './queries/image';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      me,
      image,
    },
  }),
});

export default schema;
