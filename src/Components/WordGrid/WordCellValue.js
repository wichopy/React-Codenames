import { Component, createElement as ce } from 'react';
import { graphql } from 'react-apollo';
import { observer, inject } from 'mobx-react'
import { ReshuffleMutation, WordCellGridQuery } from '../gqlCalls'

@inject('authStore', 'modifierStore')
@observer
class WordCellValue extends Component {
  handleWordClick = (ev, id) => {
    ev.stopPropagation()
    this.props.mutate({
      variables: { index: id },
      refetchQueries: [ { query: WordCellGridQuery }]
    }).then(() => this.props.authStore.getToken())
  }

  render() {
    const { id, value, isEnabled, modifierStore, authStore } = this.props
    let className = 'word-cell-value'
    if (!isEnabled) {
      className += ' disabled'
    }
  
    if (modifierStore.enableReshuffle && authStore.token) {
      className += ' inReshuffleMode'
    }
    return ce('span', 
      { name: id,
        className,
        onClick: isEnabled && modifierStore.enableReshuffle && authStore.token ? 
                 (ev) => this.handleWordClick(ev, id) :
                 () => { return } 
      }, value
    )
  }
}

export default graphql(ReshuffleMutation)(WordCellValue)
