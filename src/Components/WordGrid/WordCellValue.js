import { createElement as ce } from 'react';
import { graphql } from 'react-apollo';

import { ReshuffleMutation, WordCellGridQuery } from '../gqlCalls'

const WordCellValue = (props) => {
  const handleWordClick = (ev, id) => {
    ev.stopPropagation()
    props.mutate({
      variables: { index: id },
      refetchQueries: [ { query: WordCellGridQuery }]
    })
  }
  
  const { id, value, isEnabled, enableReshuffle, token } = props
  let className = 'word-cell-value'
  if (!isEnabled) {
    className += ' disabled'
  }

  if (enableReshuffle && token) {
    className += ' inReshuffleMode'
  }

  return ce('span', 
    { name: id,
      className,
      onClick: isEnabled && enableReshuffle && token ? 
               (ev) => handleWordClick(ev, id) :
               () => { return } 
    }, value
  )
}

export default graphql(ReshuffleMutation)(WordCellValue)
