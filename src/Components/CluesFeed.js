import { Component, createElement as ce} from 'react';
import { CluesfeedQuery, CurrentClueQuery } from './gqlCalls';
import { graphql, compose } from 'react-apollo';

import ClueAdder from './CluesAdder';
class CluesFeed extends Component {
  render() {
    const { Cluesfeed, currentQueryPresent } = this.props
    if (Cluesfeed.loading || currentQueryPresent.loading) {
      return ce('p', {}, 'Loading...')
    }
    if (Cluesfeed.error || currentQueryPresent.error) {
      return ce('p', {}, "Error loading.")
    }
    let clues = [...Cluesfeed.clues];
    console.log(this.props.currentQueryPresent)
    if (!currentQueryPresent.clue) {
      clues.unshift({ hint: '', associated: 0 })
    }
    return ce('div', {},
      ce('h3', {}, 'Clues Goose:'),
      ce('div', {className: 'Clues-adder' },
        ce(ClueAdder, {})
      ),
      ce('ul', { className: 'list-group'},
        clues.map((clue,i) => {
          if (!currentQueryPresent.clue && i === 0) {
            return ce('li', { key: i, className: 'list-group-item' }, ce('b', {}, ' ENTER A CLUE! '))
          }
          if (i === 0) {
            console.log(currentQueryPresent)
            return ce('li', { key: i, className: 'list-group-item' }, ce('b', {}, clue.hint + ' - ' + clue.associated))
          }
          return ce('li', { key: i, className: 'list-group-item' }, clue.hint + ' - ' + clue.associated)
        })
      )
    )
  }
}

const PopulatedCluesfeed = compose(
  graphql(CluesfeedQuery, {
    name: 'Cluesfeed',
    options: { pollInterval: 5000 },
  }),
  graphql(CurrentClueQuery, {
    name: 'currentQueryPresent',
    options: { pollInterval: 5000 },
  }),
)(CluesFeed)

// graphql(CluesfeedQuery, {
//   options: { pollInterval: 5000 },
// })(CluesFeed);

export default PopulatedCluesfeed
