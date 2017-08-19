import { Component, createElement as ce} from 'react';
import { CluesfeedQuery } from './gqlCalls';
import { graphql } from 'react-apollo';

import ClueAdder from './CluesAdder';
class CluesFeed extends Component {
  render() {
    const { loading, error, clues } = this.props.data
    if (loading) {
      return ce('p', {}, 'Loading...')
    }
    if (error) {
      return ce('p', {}, error.message)
    }
    return ce('div', {},
      ce('h3', {}, 'Clues Goose:'),
      ce('div', {className: 'Clues-adder' },
        ce(ClueAdder, {})
      ),
      ce('ul', {},
        clues.map((clue,i) => {
          return ce('li', { key: i }, clue.hint + ' - ' + clue.associated)
        })
      )
    )
  }
}

const PopulatedCluesfeed = graphql(CluesfeedQuery, {
  options: { pollInterval: 5000 },
})(CluesFeed);

export default PopulatedCluesfeed
