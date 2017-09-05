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

const turnsManager = new TurnsManager()

const hideCells = wordCell => {
  if (wordCell.isEnabled === false) {
    return wordCell
  }
  return {...wordCell, type: 'Hidden'} 
}

const pointsAdder = (type) => {
  if (type == 'Red') {
    Scoreboard.Red ++
    if (Scoreboard.Red == 9) {
      turnsManager.declareWinner('Red')
    }
  }
  if (type == 'Blue') {
    Scoreboard.Blue ++
    if (Scoreboard.Blue == 8) {
      turnsManager.declareWinner('Blue')
    }
  }
  turnsManager.listenToGuesses()
}

const cluesAllowed = () => {
  let { currentTurn } = turnsManager.state
  if (currentTurn  === 'Red') {
    return 9 - Scoreboard.Red
  }
  return 8 - Scoreboard.Blue
}

const clueExists = () => {
  return turnsManager.state.numberOfClues !== 0
}

const clueAdder = (hint, associated) => { 
  Cluesfeed.unshift({ hint, associated })
  turnsManager.listenToClues(associated)
}

const pubsub = new PubSub()

export const resolvers = {
  Query: {
    wordCells: (_, args, context) => {
      if (!context.spymaster) {
        const hideUnselectedCells = Words.map(hideCells)
        return hideUnselectedCells
      }
      return Words;
    },
    score: () => {
      return Scoreboard;
    },
    turn: () => {
      return turnsManager.state
    },
    clues: () => {
      return Cluesfeed
    },
    clue: () => {
      return turnsManager.state.numberOfClues > 0
    }
  },
  Mutation: {
    selectWord: (root, args, ctx) => {
      const selectedWord = Words.find( (element, index) => {
        if (element.index == args.index) {
          return element
        }
      })
      if (turnsManager.state.numberOfClues == 0) {
        console.log('Can\'t guess a word if you don\'t have a clue!')
        return
      }
      Words[selectedWord.index].isEnabled = false
      pointsAdder(selectedWord.type)
      turnsManager.wordSelected(selectedWord.type)
      pubsub.publish(cluePresentSubscription, { cluePresentSubscription: turnsManager.state.numberOfClues > 0 }) 
      pubsub.publish(wordGridSubscription, { wordGridSubscription: Words})
      pubsub.publish(scoreboardSubscription, { scoreboardSubscription: Scoreboard })
      pubsub.publish(currentTurnSubscription, { currentTurnSubscription: turnsManager.state })

      return Words[selectedWord.index]
    },
    addClue: (_, args) => {
      let maxClues = cluesAllowed()
      if (args.associated > maxClues) {
        console.log('Too many clues. Reduce and try again.')
        return { maxClues }
      }
      if (clueExists()) {
        console.log('Already entered clue for the turn.')
        return { secondClue: true }
      }

      clueAdder(args.hint, args.associated)

      pubsub.publish(cluePresentSubscription, { cluePresentSubscription: turnsManager.state.numberOfClues > 0 }) 
      pubsub.publish(cluesFeedSubscription, { cluesFeedSubscription: Cluesfeed })
    },
    skipTurn: () => {
      console.log('Team has decided to skip the rest of their turn.')
      turnsManager.switchTurn()
      pubsub.publish(cluePresentSubscription, { cluePresentSubscription: turnsManager.state.numberOfClues > 0 }) 
      pubsub.publish(currentTurnSubscription, { currentTurnSubscription: turnsManager.state })
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
      resolve: (payload, args, context) => {
        if (!context.spymaster) {
          return payload.wordGridSubscription.map(hideCells)
        }
        else {
          return payload
        }
      },
      subscribe: () => pubsub.asyncIterator(wordGridSubscription),
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
