import { Component, createElement as ce } from 'react';
import { graphql } from 'react-apollo';
import { SelectWordMutation, WordCellGridQuery, ScoreboardQuery, CurrentTurnQuery } from './gqlCalls'
import { ToastDanger } from 'react-toastr-basic'

import WordCellValue from './WordCellValue'

class WordCell extends Component {
  handleCellClick = (position) => {
    this.props.mutate({
      variables: { index: position },
      refetchQueries: [ { query: WordCellGridQuery }, { query: ScoreboardQuery }, { query: CurrentTurnQuery }]
    }).then( res => {
      if (res.data.selectWord == null) {
        console.log("Enter clues before beginning next round.")
        ToastDanger('Enter a clue before you start the round.')
      }
    });
  }

  render() {
    let { type, isEnabled, value, id } = this.props
    let { handleCellClick } = this
    let className = 'word-cell ' + type
    if (!isEnabled) {
      className += ' disabled'
    }

    return ce('td', {
      className: className,
      name: id,
      onClick: isEnabled ? 
               () => handleCellClick(id) : 
               () => { return },
      }, ce(WordCellValue, { id, value }),
    );
  }
};

const WordCellWithMutation = graphql(SelectWordMutation)(WordCell);

export default WordCellWithMutation;
