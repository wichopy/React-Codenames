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

  type Scoreboard {
    Red: Int
    Blue: Int
  }

  type CurrentTurn {
    currentTurn: String!
  }

  type Query {
    wordCells: [WordCell]
    score: Scoreboard
    turn: CurrentTurn
  }

  type Mutation {
    selectWord(index: Int!): WordCell
  }

`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export { schema };
