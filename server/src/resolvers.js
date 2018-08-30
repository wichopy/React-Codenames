import { PubSub, withFilter } from 'graphql-subscriptions';
import jwt from '../../../../Library/Caches/typescript/2.9/node_modules/@types/jsonwebtoken'

import WordGrid from '../Controllers/WordGrid'
import Scoreboard from '../Controllers/Scoreboard'
import TurnsManager from '../Controllers/TurnsManager'
import CluesFeed from '../Controllers/CluesFeed'

import { JWT_SECRET } from '../config'
import { GameSessionStore } from './connectors'
import { createError } from 'apollo-errors';

const wordGridSubscription = 'wordGridSubscription'
const cluesFeedSubscription = 'cluesFeedSubscription'
const cluePresentSubscription = 'cluePresentSubscription'
const scoreboardSubscription = 'scoreboardSubscription'
const currentTurnSubscription = 'currentTurnSubscription'
const endGameSubscription = 'endGameSubscription'


// Wrapper resolvers via https://www.youtube.com/watch?v=4_Bcw7BULC8

//TODO: Have unique game sessions and store password inside of these game sessions instead of in resolvers.
let password

let turnsManager = new TurnsManager()

const pubsub = new PubSub()
const gameSessionStore = new GameSessionStore()


// const pointsAdder = (type) => {
//   if (type == 'Red') {
//     scoreBoard.Red ++
//     if (scoreBoard.Red == 9) {
//       turnsManager.declareWinner('Red')
//       pubsub.publish(endGameSubscription, { endGameSubscription: true })
//     }
//   }
//   if (type == 'Blue') {
//     scoreBoard.Blue ++
//     if (scoreBoard.Blue == 8) {
//       turnsManager.declareWinner('Blue')
//       pubsub.publish(endGameSubscription, { endGameSubscription: true })
//     }
//   }
//   turnsManager.listenToGuesses()
// }

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

/*
  Game pipeline:
  All reducers are stateless functions in their own domains.
  Game logic is composed inside resolvers using the state returned from the game session and passing it through the different reducers.
                                                               Valid: Return game session
  Query/Mutation -> resolver -> resolverWrapper -> GameSession -> reducers -> return
                                                      |
                                                      |
                                                      ⎣Invalid: Return error
*/

const GameNotFoundError = createError('GameNotFoundError', {
  message: 'You are not authorized!'
})

// resolver wrapper. Returns a promise to handle async actions in the future.
const checkGameNameAndResolve = (context) => {
  return new Promise((resolve, reject) => {
    const { gameName } = context
    const gameSession = gameSessionStore.getSession(gameName)
    if (gameSessionStore.getSession(gameName)) {
      resolve(gameSession)
    } else {
      reject(new GameNotFoundError())
    }
  })
}

export const resolvers = {
  Query: {
    session: (root, args, context) => {
      const { gameName, spymaster } = context
      console.log(gameSessionStore)
      if (!gameSessionStore.getSession(gameName)) {
        return { gameExists: false}
      }
      return { gameExists: true}
    },
    wordCells: (root, args, context) => {
      return checkGameNameAndResolve(context).then(gameSession => {
        return WordGrid.displayWordGrid(gameSession.wordsGrid, context.spymaster)
      })
    },
    score: (root, args, context) => {
      return checkGameNameAndResolve(context).then(gameSession => {
        return gameSession.scoreBoard
      })
    },
    turn: () => {
      return turnsManager.state
    },
    clues: (root, args, context) => {
      return checkGameNameAndResolve(context).then(gameSession => {
        return gameSession.cluesFeed
      })
    },
    clue: () => {
      return turnsManager.state.numberOfClues > 0
    },
    endGame: () => {
      return turnsManager.state.winner !== ''
    }
  },
  Mutation: {
    selectWord: (root, args, context) => {
      return checkGameNameAndResolve(context).then(gameSession => {
        const selectedWord = gameSession.wordsGrid.find(word => {
          if (+word.index === +args.index) {
            return word
          }
        })

        if (gameSession.numberOfClues === 0) {
          console.log('Can\'t guess a word if you don\'t have a clue!')
          return
        }

        const nextWordGrid = WordGrid.disableWord(gameSession.wordsGrid, args.index)

        let nextScoreboard
        let nextTurnManager

        if (selectedWord.type === 'Red') {
          nextScoreboard = Scoreboard.incrementRed(gameSession.scoreBoard)
          if (nextScoreboard.Red === 9) {
            nextTurnManager = TurnsManager.declareWinner(gameSession.turnsManager, 'Red')
            pubsub.publish(endGameSubscription, { endGameSubscription: true })
          }
        }

        if (selectedWord.type === 'Blue') {
          nextScoreboard = Scoreboard.incrementBlue(gameSession.scoreBoard)
          if (nextScoreboard.Blue === 8) {
            nextTurnManager = TurnsManager.declareWinner(gameSession.turnsManager, 'Blue')
            pubsub.publish(endGameSubscription, { endGameSubscription: true })
          }
        }

        nextTurnManager = TurnsManager.increaseNumberOfGuesses(gameSession.turnsManager)
        console.log('Guessed a word.')


        this.endTurnAfterGuessingAllClues()

        // ----- TurnsManager.wordSelected
        // if (selectedWord.type == 'Innocent') {
        //   // Do nothing.
        //   return
        // }

        if (selectedWord.type == 'Assassin') {
          // End game, Other team wins
          // BUG: Not declaring winner properly on a assassin lose.
          if (gameSession.turnsManager.currentTurn == 'Red') {
            if (gameSession.turnsManager.guessedAllClues) {
              nextTurnManager = TurnsManager.declareWinner(gameSession.turnsManager, 'Red')
            }
            nextTurnManager = TurnsManager.declareWinner(gameSession.turnsManager, 'Blue')
          }

          if (gameSession.turnsManager.currentTurn == 'Blue') {
            if (gameSession.turnsManager.guessedAllClues) {
              nextTurnManager = TurnsManager.declareWinner(gameSession.turnsManager, 'Blue')
            }
            nextTurnManager = TurnsManager.declareWinner(gameSession.turnsManager, 'Red')
          }

          pubsub.publish(endGameSubscription, { endGameSubscription: true })
        }

        if (selectedWord.type !== gameSession.turnsManager.currentTurn ) {
          // Switch turns if user selects word for the other team.
          console.log('Woopse guessed word for other team, switch turns')
          nextTurnManager = TurnsManager.switchTurn(gameSession.turnsManager)
        }

        // -----

        pubsub.publish(cluePresentSubscription, { cluePresentSubscription: nextTurnManager.numberOfClues > 0 })
        pubsub.publish(wordGridSubscription, { wordGridSubscription: nextWordGrid})
        pubsub.publish(scoreboardSubscription, { scoreboardSubscription: nextScoreboard })
        pubsub.publish(currentTurnSubscription, { currentTurnSubscription: nextTurnManager })

        gameSession.updateSessionState(context.gameName, {
          turnsManager: nextTurnManager,
          scoreBoard: nextScoreboard,
          wordsGrid: nextWordGrid,
        })

        return nextWordGrid
      })

      // const selectedWord = Words.find(element => {
      //   if (element.index == args.index) {
      //     return element
      //   }
      // })
      // if (turnsManager.state.numberOfClues == 0) {
      //   console.log('Can\'t guess a word if you don\'t have a clue!')
      //   return
      // }

      // Words[selectedWord.index].isSelectable = false
      // pointsAdder(selectedWord.type)
      // if (turnsManager.wordSelected(selectedWord.type) === 'endGame') {
      //   pubsub.publish(endGameSubscription, { endGameSubscription: true })
      // }
      // pubsub.publish(cluePresentSubscription, { cluePresentSubscription: turnsManager.state.numberOfClues > 0 })
      // pubsub.publish(wordGridSubscription, { wordGridSubscription: Words})
      // pubsub.publish(scoreboardSubscription, { scoreboardSubscription: scoreBoard })
      // pubsub.publish(currentTurnSubscription, { currentTurnSubscription: turnsManager.state })

      // return Words[selectedWord.index]
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
      gameSessionStore.createNewGame(args.gameName, args.password, {
        turnsManager: TurnsManager.generate(),
        scoreBoard: Scoreboard.generate(),
        cluesfeed: CluesFeed.generate(),
        wordsGrid: WordGrid.generate(),
      })
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
    newGame: (root, args, context) => {
      return checkGameNameAndResolve(context).then(gameSession => {
        gameSessionStore.resetGame(args.gameName, {
          turnsManager: TurnsManager.generate(),
          scoreBoard: Scoreboard.generate(),
          cluesfeed: CluesFeed.generate(),
          wordsGrid: WordGrid.generate(),
        })
        pubsub.publish(endGameSubscription, { endGameSubscription: false })
      })
    },
    // reshuffleWord: (_, args, ctx) => {
    //   wordGrid.reshuffleCell(args.index)
    //   Words = wordGrid.wordGrid
    //   pubsub.publish(wordGridSubscription, { wordGridSubscription: Words })

    //   return Words[args.index]
    // }
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
