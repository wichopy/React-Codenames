import {
  makeExecutableSchema,
} from 'graphql-tools'

import { resolvers } from './resolvers';

const typeDefs = `
  type WordCell {
    index: Int!
    type: String!
    word: String!
    isSelectable: Boolean!
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
    team: String!
  }

  type Session {
    gameExists: Boolean
  }

  type Query {
    session: Session
    wordCells: [WordCell]
    score: Scoreboard
    turn: CurrentTurn
    clue: Boolean!
    clues: [Clue]
    endGame: Boolean!
  }

  type Success {
    success: Boolean!
  }

  type AddClueMessage {
    maxClues: Int
    secondClue: Boolean
  }

  type Mutation {
    selectWord(index: Int!): WordCell
    addClue(hint: String!, associated: Int!): AddClueMessage
    skipTurn: Boolean
    createGameSession(password: String, gameName: String!): String
    createSpymaster(password: String!): Success
    loginAsSpymaster(password: String!): String
    newGame: Boolean
    reshuffleWord(index: Int!): WordCell
  }

  type Subscription {
    wordGridSubscription: [WordCell]
    cluesFeedSubscription: [Clue]
    cluePresentSubscription: Boolean
    scoreboardSubscription: Scoreboard
    currentTurnSubscription: CurrentTurn
    endGameSubscription: Boolean
  }

`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export { schema };
