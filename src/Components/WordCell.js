import { createElement as ce } from 'react'

const WordCell = (id, value, type, isEnabled, selectHandler) => {
  let className = 'word-cell ' + type
  if (!isEnabled) {
    className += ' disabled'
  }
  return ce('td', {
    className: className,
    name: id,
    onClick: isEnabled? () => selectHandler(id, value, type) : () => { return },
  }, value);
};

export default WordCell;
