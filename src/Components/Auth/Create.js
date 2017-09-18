import { Component, createElement as ce } from 'react';
import { graphql } from 'react-apollo';
import { observer } from 'mobx-react'

import { SetSpymasterMutation } from '../gqlCalls';
@observer
class Create extends Component {
  state = {
    password: ''
  }

  handleKeyUp = ev => {
    this.setState({ password: ev.target.value })
  }

  createSpymaster = () => {
    this.props.mutate({
      variables: { password: this.state.password }
    }).then(() => {
      console.log("Created spymster")
    }).catch(() => console.log('Error making spymaster'))
  }
  render() {
    if (this.props.authStore.token) {
      return ce('div', {})
    }
    
    return ce('span', { className: 'form-group card' },
      ce('h3', {}, 'Set Spymaster Password'),
      ce('input', { name: 'password',
        type: 'password',
        className: 'form-control',
        placeholder: 'Password',
        onKeyUp: ev => this.handleKeyUp(ev) }),
      ce('button', { className: 'btn btn-primary', onClick: this.createSpymaster }, 'Create Spymaster'),
    )
  }
}

export default graphql(SetSpymasterMutation)(Create)
