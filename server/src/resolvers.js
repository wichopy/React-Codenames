import Words from '../Models/WordGrid'
import Scoreboard from '../Models/Scoreboard'
import TurnsManager from '../Models/TurnsManager'
import Cluesfeed from '../Models/CluesFeed'

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
      return Words[selectedWord.index]
    },
    addClue: (_, args) => {
      clueAdder(args.hint, args.associated)
      return Cluesfeed
    },
    skipTurn: () => {
      TurnsManager.switchTurn()
    }
  }
};
