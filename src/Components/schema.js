export const typeDefs = `
  type WordCell {
    type: String!
    isSelectable: Boolean!
    index: Int!
    word: String!
  }

  type Query {
    wordCells: [WordCell]
  }

`;
