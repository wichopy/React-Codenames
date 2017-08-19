export const typeDefs = `
  type WordCell {
    type: String!
    isEnabled: Boolean!
    index: Int!
    word: String!
  }

  type Query {
    wordCells: [WordCell]
  }

`;
