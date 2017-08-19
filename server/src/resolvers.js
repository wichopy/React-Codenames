import words from '../Models/WordGrid'
import { Scoreboard } from '../Models/Scoreboard'

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
      return words[selectedWord.index]
    }
  }
};
