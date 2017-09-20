import { Component, createElement as ce } from 'react'
import { observer, inject } from 'mobx-react'
import { graphql } from 'react-apollo'

import { NewSessionMutation } from './gqlCalls'

@inject('sessionStore')
@observer
class NewGame extends Component {
  state = {
    gameId: ''
  }

  handleKeyUp = ev => {
    this.setState({ gameId: ev.target.value })
  }

  handleCreate = () => {
    const { mutate, sessionStore } = this.props
    mutate({
      variables: { gameId: this.state.gameId }
    }).then(res => {
      if (res.data) {
        sessionStore.setGameId(res.data.newSession)
      }
    })
  }
  render() {
    return ce('div', {}, 
      ce('div', { className: 'form-group'},
        ce('label', {}, 'Game Name'),
        ce('input', { onKeyUp: ev => this.handleKeyUp(ev) }),
      ),
      ce('button', { className: 'btn', onClick: this.handleCreate }, 'Create'),
      ce('button', { className: 'btn' }, 'Join'),
    )
  }
}

export default graphql(NewSessionMutation)(NewGame)
