import { Component, createElement as ce } from 'react'
import { graphql } from 'react-apollo'
import { EndGameSubscription, EndGameQuery } from './gqlCalls'

import NewGameButton from './NewGameButton'

class NewGameWrapper extends Component {
  componentWillMount() {
    this.props.EndGameQuery.subscribeToMore({
      document: EndGameSubscription,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev
        }
        return {
          endGame: subscriptionData.data.endGameSubscription
        }
      },
    })
  }

  render() {
    const { loading, error, endGame } = this.props.EndGameQuery
    if (loading) {
      return ce('p', {}, 'loading....')
    }
    if (error) {
      return ce('p', {}, 'error....')
    }
    return ce('div', {},
      endGame ? ce(NewGameButton, {}): ''
    )
  }
}

export default graphql(EndGameQuery, { name: 'EndGameQuery' })(NewGameWrapper);
