
import WordGrid from '../Models/WordGrid'
import Scoreboard from '../Models/Scoreboard'
import TurnsManager from '../Models/TurnsManager'
import CluesFeed from '../Models/CluesFeed'

// Support in memory game sessions.
// TODO: Persist game session data.

const gameSessions = { hello: {}}

// TODO: Return promises so transition to persisted data is seamless.
const GameSession = {
  // Create a new game session and add to the gameSessions in memory cache
  createNewGame: (gameName, password) => {
    const wordGrid = new WordGrid()
    gameSessions[gameName] = {
      turnsManager: new TurnsManager(),
      scoreBoard: new Scoreboard(),
      cluesfeed: new CluesFeed(),
      words: wordGrid.generate().wordGrid,
      password,
    }
  },
  // Retrieve a game session for resolvers to use.
  getSession: (gameName) => {
    return gameSessions[gameName]
  }
}

export { GameSession }
