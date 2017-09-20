import { Component, createElement as ce} from 'react';
import { graphql, compose } from 'react-apollo';
import { observer, inject } from 'mobx-react'

import { CluesfeedQuery,
  CurrentClueQuery,
  CluePresentSubscription,
  CluesFeedSubscription } from '../gqlCalls';
import ClueAdder from './CluesAdder';

@inject('authStore')
@observer
class CluesFeed extends Component {

  componentWillMount() {
    this.props.Cluesfeed.subscribeToMore({
      document: CluesFeedSubscription,
      updateQuery: (previousState, {subscriptionData}) => {
        if (!subscriptionData) {
          return previousState
        }
        return {
          clues: subscriptionData.data.cluesFeedSubscription
        }
      },
    })
    this.props.currentQueryPresent.subscribeToMore({
      document: CluePresentSubscription,
      updateQuery: (previousState, {subscriptionData}) => {
        if (!subscriptionData) {
          return previousState
        }
        return {
          clue: subscriptionData.data.cluePresentSubscription
        }
      },
    })
  }

  render() {
    const { Cluesfeed, currentQueryPresent, authStore } = this.props
    if (Cluesfeed.loading || currentQueryPresent.loading) {
      return ce('p', {}, 'Loading...')
    }
    if (Cluesfeed.error || currentQueryPresent.error) {
      return ce('p', {}, "Error loading.")
    }
    let clues = [...Cluesfeed.clues];
    if (!currentQueryPresent.clue) {
      clues.unshift({ hint: '', associated: 0 })
    }
    return ce('div', {},
      ce('h3', {}, 'Clues Goose:'),
      authStore.token ? ce('div', {className: 'Clues-adder' },
        ce(ClueAdder, {})
      ) : '',
      ce('ul', { className: 'list-group'},
        clues.map((clue,i) => {
          if (!currentQueryPresent.clue && i === 0) {
            return ce('li', { key: i, className: 'list-group-item' }, ce('b', {}, ' ENTER A CLUE! '))
          }
          if (i === 0) {
            return ce('li', { key: i, className: 'list-group-item ' + clue.team }, ce('b', {}, clue.hint + ' - ' + clue.associated))
          }
          return ce('li', { key: i, className: 'list-group-item ' + clue.team + ' old' }, clue.hint + ' - ' + clue.associated)
        })
      )
    )
  }
}

const PopulatedCluesfeed = compose(
  graphql(CluesfeedQuery, {
    name: 'Cluesfeed',
  }),
  graphql(CurrentClueQuery, {
    name: 'currentQueryPresent',
  }),
)(CluesFeed)

export default PopulatedCluesfeed
