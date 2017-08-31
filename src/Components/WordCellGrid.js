import { Component, createElement as ce } from 'react'
import { WordCellGridQuery, WordGridSubscription } from './gqlCalls';
import { graphql } from 'react-apollo';

import WordCellWithMutation from './WordCell'

class WordCellGrid extends Component {
  size = 5;
  numberOfRows = Array(this.size).fill('');

  componentWillMount() {
    this.props.WordCellGridQuery.subscribeToMore({
      document: WordGridSubscription,
      updateQuery: (previousState, {subscriptionData}) => {
        if (!subscriptionData) {
          return previousState
        }
        return {
          wordCells: subscriptionData.data.wordGridSubscription
        }
      },
    })
  }

  componentDidMount() {
    console.log("Word Cell Grid Mounted")
  }

  render() {
    const { loading, error, wordCells } = this.props.WordCellGridQuery
    const { numberOfRows } = this
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
              wordCells.slice(i*5, i*5+5).map((cell, index) => {
                return ce(WordCellWithMutation, {key: cell.index, id: i*5+index, value: cell.word, type: cell.type, isEnabled: cell.isEnabled})
              })
            )
          )
        })
      )
    )
  }
}

const PopulatedWordCellGrid = graphql(WordCellGridQuery, {
  name: 'WordCellGridQuery'})(WordCellGrid);

export default PopulatedWordCellGrid;
