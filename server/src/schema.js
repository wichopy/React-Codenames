import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools'

import { resolvers } from './resolvers';

const typeDefs = `
  type WordCell {
    index: Int!
    type: String!
    word: String!
    isEnabled: Boolean!
  }

  type Query {
    wordCells: [WordCell]
  }

  type Mutation {
    selectWord(index: Int!): WordCell
  }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export { schema };
