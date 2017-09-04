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
      maxClues
    }
  }
`;

export const SkipTurnMutation = gql`
  mutation {
    skipTurn
  }
`;

export const CurrentClueQuery = gql`
  query {
    clue
  }
`;

export const WordGridSubscription = gql`
  subscription {
    wordGridSubscription {
      index
      word
      type
      isEnabled
    }
  }
`;

export const CluesFeedSubscription = gql`
  subscription {
    cluesFeedSubscription {
      hint
      associated
    }
  }
`;

export const CluePresentSubscription = gql`
  subscription {
    cluePresentSubscription 
  }
`;

export const ScoreboardSubscription = gql`
  subscription {
    scoreboardSubscription {
      Red
      Blue
    }
  }
`;

export const CurrentTurnSubscription = gql`
  subscription {
    currentTurnSubscription {
      currentTurn
      winner
    }
  }
`;

export const SetSpymasterMutation = gql`
  mutation createSpymaster($password: String!){
    createSpymaster(password: $password) {
      success
    }
  }
`;

export const LoginAsSpymasterMutation = gql`
  mutation loginAsSpymaster($password: String!) {
    loginAsSpymaster(password: $password)
  }
`;