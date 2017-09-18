import { Component, createElement as ce } from 'react';
import { graphql } from 'react-apollo';

import { observer } from 'mobx-react'
import { LoginAsSpymasterMutation } from '../gqlCalls';
import GQLStore from '../../Stores/GQLStore'

@observer
class Login extends Component {
  state = {
    password: ''
  }

  handleKeyUp = ev => {
    this.setState({ password: ev.target.value })
  }

  handleLogin = () => {
    console.log('loggin in...')
      this.props.mutate({
        variables: { password: this.state.password },
      }).then(token => {
        this.props.authStore.cacheToken(token.data.loginAsSpymaster)
        return
      }).then( () => {
        GQLStore.callbacks.WordCellGridRefetch()
        return
      }).catch(err => {
      console.log(err)
    })
  }
  render() {
    if (this.props.authStore.token) {
      return ce('div', {})
    }

    return ce('span', { className: 'form-group card' },
      ce('h3', {}, 'Access spymaster view'),
      ce('input', { name: 'password',
        type: 'password',
        className: 'form-control',
        placeholder: 'Password',
        onKeyUp: ev => this.handleKeyUp(ev) }),
      ce('button', { className: 'btn btn-primary', onClick: this.handleLogin }, 'View as Spymaster'),
    )
  }
}

export default graphql(LoginAsSpymasterMutation)(Login)
