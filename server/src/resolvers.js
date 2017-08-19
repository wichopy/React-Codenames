import words from '../Models/WordGrid.js'

export const resolvers = {
  Query: {
    wordCells: () => {
      return words;
    },
  },
  Mutation: {
    selectWord: (root, args) => {
      const selectedWord = words.find( (element, index) => {
        if (element.index == args.index) {
          return element
        }
      })
      words[selectedWord.index].isEnabled = false
      return words[selectedWord.index]
    }
  }
};
