import CluesFeed from './CluesFeed'
import Scoreboard from './Scoreboard'
import TurnsManager from './TurnsManager'
import WordGrid from './WordGrid'

class GameSession {
  constructor (gameId) {
    this.gameId = gameId
    this.password = ''
    this.turnsManager = new TurnsManager()
    this.scoreBoard = new Scoreboard()
    this.wordGrid = new WordGrid()
    this.Cluesfeed = new CluesFeed()
    this.wordGrid.generate()
    this.Words = this.wordGrid.wordGrid
  }
}

export default GameSession; 
