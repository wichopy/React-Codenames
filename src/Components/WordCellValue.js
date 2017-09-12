import { createElement as ce } from 'react';
import { graphql } from 'react-apollo';

import { ReshuffleMutation, WordCellGridQuery } from './gqlCalls'

const WordCellValue = (props) => {
  const handleWordClick = (ev, id) => {
    ev.stopPropagation()
    props.mutate({
      variables: { index: id },
      refetchQueries: [ { query: WordCellGridQuery }]
    })
  }
  
  const { id, value } = props

  return ce('span', 
    { name: id,
      className: 'word-cell-value',
      onClick: (ev) => handleWordClick(ev, id)}, 
    value
  )
}

export default graphql(ReshuffleMutation)(WordCellValue)
