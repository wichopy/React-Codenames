import { Component, createElement as ce } from 'react'
import { graphql } from 'react-apollo'

import {
  NewGameMutation,
  WordCellGridQuery,
  ScoreboardQuery,
  CurrentTurnQuery,
  CluesfeedQuery,
} from './gqlCalls'

class NewGameButton extends Component {

  handleClick = () => {
    this.props.mutate({
      refetchQueries: [ 
        { query: WordCellGridQuery },
        { query: ScoreboardQuery },
        { query: CurrentTurnQuery },
        { query: CluesfeedQuery },
      ]
    })
  }

  render = () => {
    return ce('button', { onClick: this.handleClick }, 'New Game')
  }
}

export default graphql(NewGameMutation)(NewGameButton)
