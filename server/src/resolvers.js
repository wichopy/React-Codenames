import { PubSub, withFilter } from 'graphql-subscriptions';
import jwt from 'jsonwebtoken'

import Words from '../Models/WordGrid'
import Scoreboard from '../Models/Scoreboard'
import TurnsManager from '../Models/TurnsManager'
import Cluesfeed from '../Models/CluesFeed'
import { JWT_SECRET } from '../config'

const wordGridSubscription = 'wordGridSubscription'
const cluesFeedSubscription = 'cluesFeedSubscription'
const cluePresentSubscription = 'cluePresentSubscription' 
const scoreboardSubscription = 'scoreboardSubscription'
const currentTurnSubscription = 'currentTurnSubscription'

//TODO: Have unique game sessions and store password inside of these game sessions instead of in resolvers.
let password

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
    wordCells: (_, args, ctx) => {
      if (!ctx.spymaster) {
        return Words.map(wordCell => {return {...wordCell, type: 'Hidden'} })
      }
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
    selectWord: (root, args, ctx) => {
      const selectedWord = Words.find( (element, index) => {
        if (element.index == args.index) {
          return element
        }
      })
      if (TurnsManager.state.numberOfClues == 0) {
        console.log('Can\'t guess a word if you don\'t have a clue!')
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
    },
    createSpymaster: (_, args, ctx) => {
      password = args.password
      console.log(`Set password as ${password}`)
      return { success: true }
    },
    loginAsSpymaster: (_, args, ctx) => {
      if (args.password === password) {
        const spymaster = { spymaster: true }
        const token = jwt.sign(spymaster, JWT_SECRET)
        ctx.spymaster = true
        return token
      }
    }
  },
  Subscription: {
    wordGridSubscription: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(wordGridSubscription),
        (payload, args, ctx) => {
          if (!ctx.spymaster) {
            return payload.wordGridSubscription.map(wordCell => { return {...wordCell, type: ''} })
          }
          else {
            return payload
          }
        }
      ),
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
