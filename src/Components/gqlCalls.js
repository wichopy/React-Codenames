import { gql } from 'react-apollo';

export const SelectWordMutation = gql`
mutation updateCell($newCell: newWordCell!) {
  updateCell(newCell: $newCell) {
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
