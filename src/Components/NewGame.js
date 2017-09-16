import { createElement as ce } from 'react'

const NewGame = (props) => {
  return ce('div', {}, 
    ce('div', { className: 'form-group'},
      ce('label', {}, 'Game Name'),
      ce('input', {}),
    ),
    ce('button', { className: 'btn' }, 'Create'),
    ce('button', { className: 'btn' }, 'Join'),
  )
}

export default NewGame
