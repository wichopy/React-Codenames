import Words from '../Models/WordGrid'
import Scoreboard from '../Models/Scoreboard'
import TurnsManager from '../Models/TurnsManager'
import Cluesfeed from '../Models/CluesFeed'

const pointsAdder = (type) => {
  if (type == 'Red') {
    Scoreboard.Red ++
  }
  if (type == 'Blue') {
    Scoreboard.Blue ++
  }
}

const clueAdder = (hint, associated) => {
  Cluesfeed.push({ hint, associated })
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

      Words[selectedWord.index].isEnabled = false
      pointsAdder(selectedWord.type)
      TurnsManager.wordSelected(selectedWord.type)
      return Words[selectedWord.index]
    },
    addClue: (_, args) => {
    clueAdder(args.hint, args.associated)
    return Cluesfeed
    }
  }
};
