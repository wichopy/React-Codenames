import {
  makeExecutableSchema,
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
    winner: String!
  }

  type Clue {
    hint: String!
    associated: Int!
  }

  type Query {
    wordCells: [WordCell]
    score: Scoreboard
    turn: CurrentTurn
    clue: Boolean!
    clues: [Clue]
  }

  type Role {
    spymaster: Boolean!
    jwt: String
  }

  type Success {
    success: Boolean!
  }

  type Mutation {
    selectWord(index: Int!): WordCell
    addClue(hint: String!, associated: Int!): [Clue]
    skipTurn: Boolean
    createSpymaster(password: String!): Success
    loginAsSpymaster(password: String!): Role
  }

  type Subscription {
    wordGridSubscription: [WordCell]
    cluesFeedSubscription: [Clue]
    cluePresentSubscription: Boolean
    scoreboardSubscription: Scoreboard
    currentTurnSubscription: CurrentTurn
  }

`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export { schema };
