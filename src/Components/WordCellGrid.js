import { Component, createElement as ce } from 'react'
import { WordCellGridQuery } from './gqlCalls';
import { graphql } from 'react-apollo';

import WordCellWithMutation from './WordCell'

// const WordCell = (id, value, type, isEnabled) => {
//   const handleClick = (position, value, type) => {
//     const newWordCell = {
//       index: position,
//       word: value,
//       type: type,
//       isEnabled: false
//     };
//     console.log(newWordCell)
//   }

//   let className = 'word-cell ' + type
//   if (!isEnabled) {
//     className += ' disabled'
//   }

//   return ce('td', {
//     className: className,
//     name: id,
//     onClick: isEnabled? () => handleClick(id, value, type) : () => { return },
//   }, value);
// }

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
    console.log(this.props.data.wordCell)
    console.log(wordCell)
    return ce('table', { className: 'word-cell-wrapper' },
      ce('tbody', {},
        numberOfRows.map((row,i) => {
          console.log(i)
          return (
            ce('tr', { key: i },
              wordCell.slice(i*5, i*5+5).map((cell, index) => {
                console.log(cell)
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
