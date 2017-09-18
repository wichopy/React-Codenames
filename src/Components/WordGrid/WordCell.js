import { Component, createElement as ce } from 'react';
import { graphql } from 'react-apollo';
import { SelectWordMutation,
  WordCellGridQuery,
  ScoreboardQuery,
  CurrentTurnQuery } from '../gqlCalls'
import { ToastDanger } from 'react-toastr-basic'
import { observer } from 'mobx-react'

import WordCellValue from './WordCellValue'

@observer
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
    const { modifierStore, authStore } = this.props
    let className = 'word-cell ' + type
    if (!isEnabled) {
      className += ' disabled'
    }

    if (authStore.token && modifierStore.enableReshuffle) {
      className += ' inReshuffleMode'
    }

    return ce('td', {
      className: className,
      name: id,
      onClick: isEnabled && !modifierStore.enableReshuffle ? 
               () => handleCellClick(id) : 
               () => { return },
      }, ce(WordCellValue, { id, value, isEnabled, modifierStore, authStore }),
    );
  }
};

const WordCellWithMutation = graphql(SelectWordMutation)(WordCell);

export default WordCellWithMutation;
