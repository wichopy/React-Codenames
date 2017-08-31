import { PubSub } from 'graphql-subscriptions';

import Words from '../Models/WordGrid'
import Scoreboard from '../Models/Scoreboard'
import TurnsManager from '../Models/TurnsManager'
import Cluesfeed from '../Models/CluesFeed'

const wordGridSubscription = 'wordGridSubscription'
const cluesFeedSubscription = 'cluesFeedSubscription'
const cluePresentSubscription = 'cluePresentSubscription' 
const scoreboardSubscription = 'scoreboardSubscription'
const currentTurnSubscription = 'currentTurnSubscription'

const pointsAdder = (type) => {
  if (type == 'Red') {
    Scoreboard.Red ++
    if (Scoreboard.Red == 9) {
      TurnsManager.declareWinner('Red')
    }
  }
  if (type == 'Blue') {
    Scoreboard.Blue ++
    if (Scoreboard.Blue == 8) {
      TurnsManager.declareWinner('Blue')
    }
  }
  TurnsManager.listenToGuesses()
}

const clueAdder = (hint, associated) => {
  Cluesfeed.unshift({ hint, associated })
  TurnsManager.listenToClues(associated)
}

const pubsub = new PubSub()

export const resolvers = {
  Query: {
    wordCells: () => {
      return Words;
    },
    score: () => {
      return Scoreboard;
    },
    turn: () => {
      return TurnsManager.state
    },
    clues: () => {
      return Cluesfeed
    },
    clue: () => {
      return TurnsManager.state.numberOfClues > 0
    }
  },
  Mutation: {
    selectWord: (root, args) => {
      const selectedWord = Words.find( (element, index) => {
        if (element.index == args.index) {
          return element
        }
      })
      if (TurnsManager.state.numberOfClues == 0) {
        // Can't guess a word if you don't have a clue!
        return
      }
      Words[selectedWord.index].isEnabled = false
      pointsAdder(selectedWord.type)
      TurnsManager.wordSelected(selectedWord.type)
      pubsub.publish(cluePresentSubscription, { cluePresentSubscription: TurnsManager.state.numberOfClues > 0 }) 
      pubsub.publish(wordGridSubscription, { wordGridSubscription: Words})
      pubsub.publish(scoreboardSubscription, { scoreboardSubscription: Scoreboard })
      pubsub.publish(currentTurnSubscription, { currentTurnSubscription: TurnsManager.state })

      return Words[selectedWord.index]
    },
    addClue: (_, args) => {
      clueAdder(args.hint, args.associated)

      pubsub.publish(cluePresentSubscription, { cluePresentSubscription: TurnsManager.state.numberOfClues > 0 }) 
      pubsub.publish(cluesFeedSubscription, { cluesFeedSubscription: Cluesfeed })

      return Cluesfeed
    },
    skipTurn: () => {
      TurnsManager.switchTurn()
      pubsub.publish(cluePresentSubscription, { cluePresentSubscription: TurnsManager.state.numberOfClues > 0 }) 
      pubsub.publish(currentTurnSubscription, { currentTurnSubscription: TurnsManager.state.currentTurn })
    }
  },
  Subscription: {
    wordGridSubscription: {
      subscribe: () => pubsub.asyncIterator(wordGridSubscription)
    },
    cluesFeedSubscription: {
      subscribe: () => pubsub.asyncIterator(cluesFeedSubscription)
    },
    cluePresentSubscription: {
      subscribe: () => pubsub.asyncIterator(cluePresentSubscription)
    },
    scoreboardSubscription: {
      subscribe: () => pubsub.asyncIterator(scoreboardSubscription)
    },
    currentTurnSubscription: {
      subscribe: () => pubsub.asyncIterator(currentTurnSubscription)
    }
  }
};
