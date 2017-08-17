import { gql } from 'react-apollo';

export const SelectWordMutation = gql`
mutation updateWordCell {
  updateCell(newCell: newWordCell) {
    index
  }
}
`;

export const WordCellGridQuery = gql`
query allWordCells {
  wordCell {
      index
      word
      type
      isEnabled
  }
}
`;