import { Component, createElement as ce } from 'react'
import { WordCellGridQuery } from './gqlCalls';
import { graphql } from 'react-apollo';

import WordCellWithMutation from './WordCell'
class WordCellGrid extends Component {
  size = 5;
  numberOfRows = Array(this.size).fill('');

  render() {
    const { loading, error, wordCell } = this.props.data
    const { size, numberOfRows } = this
    if (loading) {
      return ce('p', {}, 'Loading...')
    }
    if (error) {
      return ce('p', {}, error.message)
    }
    return ce('table', { className: 'word-cell-wrapper' },
      ce('tbody', {},
        numberOfRows.map((row,i) => {
          return (
            ce('tr', { key: i },
              wordCell.slice(i*5, i*5+5).map((cell, index) => {
                return ce(WordCellWithMutation, {key: cell.index, id: i*5+index, value: cell.word, type: cell.type, isEnabled: cell.isEnabled})
              })
            )
          )
        })
      )
    )
  }
}

const PopulatedWordCellGrid = graphql(WordCellGridQuery)(WordCellGrid);

export default PopulatedWordCellGrid;
