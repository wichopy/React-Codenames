import words from '../Models/WordGrid'
import { Scoreboard } from '../Models/Scoreboard'
import turnsManager from '../Models/TurnsManager'

const pointsAdder = (type) => {
  if (type == 'Red') {
    Scoreboard.Red ++
  }
  if (type == 'Blue') {
    Scoreboard.Blue ++
  }
}

export const resolvers = {
  Query: {
    wordCells: () => {
      return words;
    },
    score: () => {
      return Scoreboard;
    },
    turn: () => {
      return turnsManager.state
    }
  },
  Mutation: {
    selectWord: (root, args) => {
      const selectedWord = words.find( (element, index) => {
        if (element.index == args.index) {
          return element
        }
      })
      words[selectedWord.index].isEnabled = false
      pointsAdder(selectedWord.type)
      turnsManager.wordSelected(selectedWord.type)
      return words[selectedWord.index]
    }
  }
};
