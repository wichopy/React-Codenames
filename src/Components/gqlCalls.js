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

export const ScoreboardQuery = gql`
  query getScore {
    score {
      Red
      Blue
    }
  }
`;

export const CurrentTurnQuery = gql`
  query currentTurnQuery {
    turn {
      currentTurn
      winner
    }
  }
`;

export const CluesfeedQuery = gql`
  query allCluesQuery {
    clues {
      hint
      associated
    }
  }
`;

export const AddClueMutation = gql`
  mutation addClue($hint: String!, $associated: Int!) {
    addClue(hint: $hint, associated: $associated) {
      hint
      associated
    }
  }
`;

export const SkipTurnMutation = gql`
  mutation {
    skipTurn
  }
`;
