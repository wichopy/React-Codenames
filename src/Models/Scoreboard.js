import { Component, createElement as ce } from 'react';
import { graphql } from 'react-apollo';
import { ScoreboardQuery, ScoreboardSubscription } from '../Components/gqlCalls';

class Scoreboard extends Component {
  componentWillMount() {
    this.props.ScoreboardQuery.subscribeToMore({
      document: ScoreboardSubscription,
      updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData) {
          return prev
        }
        return {
          score: subscriptionData.data.scoreboardSubscription
        }
      }
    })
  }
  
  render() {
    let {loading, error, score } = this.props.ScoreboardQuery
    if (loading) {
      return ce('p', {}, 'Loading...')
    }
    if (error) {
      return ce('p', {}, error.message)
    }
    return ce('div', { className: 'row' },
      ce('div', { className: 'col-6' },
        'Red Team - ' + score.Red,
      ),
      ce('div', { className: 'col-6' },
        'Blue Team - ' + score.Blue,
      )
    )
  }
}

const ScoreboardWithData = graphql(ScoreboardQuery, {
name: 'ScoreboardQuery'})(Scoreboard);
export default ScoreboardWithData;
