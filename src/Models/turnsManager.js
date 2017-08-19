import { createElement as ce } from 'react';
import { graphql } from 'react-apollo';
import { CurrentTurnQuery } from '../Components/gqlCalls';

const TurnsManager = ({ data}) => {
  let {loading, error, turn } = data
  if (loading) {
    return ce('p', {}, 'Loading...')
  }
  if (error) {
    return ce('p', {}, error.message)
  }
  return ce('p', {}, 'It is currently this team\'s turn:' + turn.currentTurn)
}

const CurrentTurnData = graphql(CurrentTurnQuery, {
  options: { pollInterval: 5000 },
})(TurnsManager);

export default CurrentTurnData;
