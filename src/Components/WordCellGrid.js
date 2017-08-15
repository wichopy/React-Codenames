import { createElement as ce } from 'react'
import WordCell from './WordCell'

const WordCellGrid = ({ data: { loading, error, wordCell}, selectWord }) => {
  const size = 5;
  const numberOfRows = Array(size).fill('');

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
          ce('tr', {},
            wordCell.slice(i*5, i*5+5).map((cell, index) => {
              return WordCell(i*5+index, cell.word, cell.type, cell.isEnabled, selectWord)
            })
          )
        )
      })
    )
  )
};

export default WordCellGrid;
