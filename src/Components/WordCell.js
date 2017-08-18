import { Component, createElement as ce } from 'react';
import { graphql } from 'react-apollo';
import { SelectWordMutation, WordCellGridQuery } from './gqlCalls'

class SelectWord extends Component {
  handleClick = (position, value, type) => {
    const newCell = {
      index: position,
      word: value,
      type: type,
      isEnabled: false
    };
    this.props.mutate({
      variables: { newCell: newCell },
      refetchQueries: [ { query: WordCellGridQuery }]
    }).then( res => console.log(res));
  }

  render() {
    let { type, isEnabled, value, id } = this.props
    let { handleClick } = this
    let className = 'word-cell ' + type
    if (!isEnabled) {
      className += ' disabled'
    }

    return ce('td', {
      className: className,
      name: id,
      onClick: isEnabled? () => handleClick(id, value, type) : () => { return },
    }, value);
  }
};

const SelectWordWithMutation = graphql(SelectWordMutation)(SelectWord);

export default SelectWordWithMutation;
