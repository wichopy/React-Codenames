import Words from '../Models/WordGrid'
import Scoreboard from '../Models/Scoreboard'
import TurnsManager from '../Models/TurnsManager'
import Cluesfeed from '../Models/CluesFeed'

const turnsManager = new TurnsManager()
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

const clueAdder = (hint, associated) => {
  Cluesfeed.unshift({ hint, associated })
  turnsManager.listenToClues(associated)
}

export const resolvers = {
  Query: {
    wordCells: () => {
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
    selectWord: (root, args) => {
      const selectedWord = Words.find( (element, index) => {
        if (element.index == args.index) {
          return element
        }
      })
      if (turnsManager.state.numberOfClues == 0) {
        // Can't guess a word if you don't have a clue!
        return
      }
      Words[selectedWord.index].isEnabled = false
      pointsAdder(selectedWord.type)
      turnsManager.wordSelected(selectedWord.type)
      return Words[selectedWord.index]
    },
    addClue: (_, args) => {
      clueAdder(args.hint, args.associated)
      return Cluesfeed
    },
    skipTurn: () => {
      turnsManager.switchTurn()
    }
  }
};
