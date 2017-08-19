import { Component, createElement as ce} from 'react';
// import { WordCellGridQuery } from './gqlCalls';
import { graphql } from 'react-apollo';

export default class CluesFeed extends Component {
  render() {
    return (
      ce('div', {},
        ce('h1', {}, 'Clues Goose:'),
        ce('ul', {},
          ce('li', {}, 'Something'),
          ce('li', {}, 'Something else'),
        )
      )
    )
  }
}
// const PopulatedWordCellGrid = graphql(WordCellGridQuery, {
//   options: { pollInterval: 5000 },
// })(WordCellGrid);

// export default PopulatedWordCellGrid;
