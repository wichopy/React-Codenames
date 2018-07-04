import { createElement as ce } from 'react'

const MainMenu = ({}) => (
  ce('div', {},
    ce('h1', {}, 'Start a new game'),
    ce('input', { type: 'text'},),
    ce('button', { }, 'Create New Game'),
  )
)

export default MainMenu
