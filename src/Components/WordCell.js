import { createElement as ce } from 'react';
import { gql, graphql } from 'graphql';
import { WordCellGridQuery } from '../App';

const SelectWord = ({ mutate }, id, value, type, isEnabled) => {
  const handleClick = (position, value, type) => {
    const newCell = {
      index: position,
      word: value,
      type: type,
      isEnabled: false
    };
    mutate({
      variables: newCell,
      refetchQueries: [ { query: WordCellGridQuery }]
    }).then( res => console.log(res));
  }

  let className = 'word-cell ' + type
  if (!isEnabled) {
    className += ' disabled'
  }
  return ce('td', {
    className: className,
    name: id,
    onClick: isEnabled? () => handleClick(id, value, type) : () => { return },
  }, value);
};

const SelectWordMutation = gql`
mutation updateCell(newCell: $newCell){
  updateCell(newCell: $NewCell) {
    index
    word
    type
    isEnabled
  }
}
`;

const SelectWordWithMutation = graphql(SelectWordMutation)(SelectWord);

export default SelectWordWithMutation;
