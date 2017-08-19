import { gql } from 'react-apollo';

export const SelectWordMutation = gql`
mutation selectWord($index: Int!) {
  selectWord(index: $index) {
    index
  }
}
`;

export const WordCellGridQuery = gql`
query allWordsQuery {
  wordCells {
      index
      word
      type
      isEnabled
  }
}`;
