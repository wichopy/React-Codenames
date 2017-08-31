import { Component, createElement as ce } from 'react';
import { graphql } from 'react-apollo';
import { CurrentTurnQuery, CurrentTurnSubscription } from '../Components/gqlCalls';

class TurnsManager extends Component {
  componentWillMount() {
    this.props.CurrentTurnQuery.subscribeToMore({
      document: CurrentTurnSubscription,
      updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData) {
          return prev
        }
        return {
          turn: subscriptionData.data.currentTurnSubscription
        }
      }
    })
  }

  render() {
    let {loading, error, turn } = this.props.CurrentTurnQuery
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
}

const CurrentTurnData = graphql(CurrentTurnQuery, {
  name: 'CurrentTurnQuery'
}, {
})(TurnsManager);

export default CurrentTurnData;
