import { createElement as ce } from 'react'
import styled from 'styled-components'

const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
`

const MainMenu = ({ onNewGameClick, onGameNameChange }) => (
  ce(StyledMenu, {},
    ce('h1', {}, 'Start a new game'),
    ce('div', {} ,
      ce('input', { type: 'text', onChange: onGameNameChange },),
      ce('button', { onClick: onNewGameClick }, 'Create New Game'),
    )
  )
)

export default MainMenu
