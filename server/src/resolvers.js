import { PubSub, withFilter } from 'graphql-subscriptions';
import jwt from 'jsonwebtoken'

import WordGrid from '../Models/WordGrid'
import Scoreboard from '../Models/Scoreboard'
import TurnsManager from '../Models/TurnsManager'
import CluesFeed from '../Models/CluesFeed'
import { JWT_SECRET } from '../config'
import { GameSession } from './connectors'

const wordGridSubscription = 'wordGridSubscription'
const cluesFeedSubscription = 'cluesFeedSubscription'
const cluePresentSubscription = 'cluePresentSubscription'
const scoreboardSubscription = 'scoreboardSubscription'
const currentTurnSubscription = 'currentTurnSubscription'
const endGameSubscription = 'endGameSubscription'

//TODO: Have unique game sessions and store password inside of these game sessions instead of in resolvers.
let password

let turnsManager = new TurnsManager()
let scoreBoard = new Scoreboard()
let wordGrid = new WordGrid()
let Cluesfeed = new CluesFeed()
wordGrid.generate()
let Words = wordGrid.wordGrid

const hideCells = wordCell => {
  if (wordCell.isEnabled === false) {
    return wordCell
  }
  return {...wordCell, type: 'Hidden'}
}

const pointsAdder = (type) => {
  if (type == 'Red') {
    scoreBoard.Red ++
    if (scoreBoard.Red == 9) {
      turnsManager.declareWinner('Red')
      pubsub.publish(endGameSubscription, { endGameSubscription: true })
    }
  }
  if (type == 'Blue') {
    scoreBoard.Blue ++
    if (scoreBoard.Blue == 8) {
      turnsManager.declareWinner('Blue')
      pubsub.publish(endGameSubscription, { endGameSubscription: true })
    }
  }
  turnsManager.listenToGuesses()
}

const cluesAllowed = () => {
  let { currentTurn } = turnsManager.state
  if (currentTurn  === 'Red') {
    return 9 - scoreBoard.Red
  }
  return 8 - scoreBoard.Blue
}

const clueExists = () => {
  return turnsManager.state.numberOfClues !== 0
}

const clueAdder = (hint, associated, team) => {
  Cluesfeed.addToCluesFeed({ hint, associated, team })
  turnsManager.listenToClues(associated)
}

const pubsub = new PubSub()

export const resolvers = {
  Query: {
    session: (_, args, context) => {
      const { gameName } = context
      console.log(GameSession)
      if (!GameSession.getSession([gameName])) {
        return { gameExists: false}
      }
      return { gameExists: true}
    },
    wordCells: (_, args, context) => {
      if (!context.spymaster) {
        const hideUnselectedCells = Words.map(hideCells)
        return hideUnselectedCells
      }
      return Words;
    },
    score: () => {
      return scoreBoard;
    },
    turn: () => {
      return turnsManager.state
    },
    clues: () => {
      return Cluesfeed.cluesFeed
    },
    clue: () => {
      return turnsManager.state.numberOfClues > 0
    },
    endGame: () => {
      return turnsManager.state.winner !== ''
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
      if (turnsManager.wordSelected(selectedWord.type) === 'endGame') {
        pubsub.publish(endGameSubscription, { endGameSubscription: true })
      }
      pubsub.publish(cluePresentSubscription, { cluePresentSubscription: turnsManager.state.numberOfClues > 0 })
      pubsub.publish(wordGridSubscription, { wordGridSubscription: Words})
      pubsub.publish(scoreboardSubscription, { scoreboardSubscription: scoreBoard })
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

      clueAdder(args.hint, args.associated, turnsManager.state.currentTurn)

      pubsub.publish(cluePresentSubscription, { cluePresentSubscription: turnsManager.state.numberOfClues > 0 })
      pubsub.publish(cluesFeedSubscription, { cluesFeedSubscription: Cluesfeed.cluesFeed })
    },
    skipTurn: () => {
      console.log('Team has decided to skip the rest of their turn.')
      turnsManager.switchTurn()
      pubsub.publish(cluePresentSubscription, { cluePresentSubscription: turnsManager.state.numberOfClues > 0 })
      pubsub.publish(currentTurnSubscription, { currentTurnSubscription: turnsManager.state })
    },
    createGameSession: (_, args, ctx) => {
      GameSession.createNewGame(args.gameName, args.password)
      // TODO: Handle errors, eg no duplicates, network errors.
      return 'Successfully created game session: ' + args.gameName
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
    },
    newGame: () => {
      turnsManager.reset()
      scoreBoard.reset()
      wordGrid.generate()
      Words = wordGrid.wordGrid
      Cluesfeed.reset()
      pubsub.publish(endGameSubscription, { endGameSubscription: false })
    },
    reshuffleWord: (_, args, ctx) => {
      wordGrid.reshuffleCell(args.index)
      Words = wordGrid.wordGrid
      pubsub.publish(wordGridSubscription, { wordGridSubscription: Words })

      return Words[args.index]
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
    },
    endGameSubscription: {
      subscribe: () => pubsub.asyncIterator(endGameSubscription)
    }
  }
};
