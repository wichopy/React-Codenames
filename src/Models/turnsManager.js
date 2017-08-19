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
  if (turn.winner !== '') {
    return ce('h3', {}, turn.winner + ' TEAM WINS!!!!')
  }
  return ce('h3', {}, 'Current Turn:' + turn.currentTurn)
}

const CurrentTurnData = graphql(CurrentTurnQuery, {
  options: { pollInterval: 5000 },
})(TurnsManager);

export default CurrentTurnData;
