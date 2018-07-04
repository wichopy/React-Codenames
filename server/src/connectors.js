
import WordGrid from '../Models/WordGrid'
import Scoreboard from '../Models/Scoreboard'
import TurnsManager from '../Models/TurnsManager'
import CluesFeed from '../Models/CluesFeed'

const gameSessions = {}

const GameSession = {
  createNewGame: (gameName) => {
    const wordGrid = new WordGrid()
    gameSessions[gameName] = {
      turnsManager: new TurnsManager(),
      scoreBoard: new Scoreboard(),
      cluesfeed: new CluesFeed(),
      words: wordGrid.generate().wordGrid,
    }
  }
}

export { GameSession }
