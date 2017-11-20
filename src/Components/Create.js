import { createElement as ce } from 'react';
import { graphql } from 'react-apollo';

import { SetSpymasterMutation } from './gqlCalls';

const Create = (props) => {
  const state = {
    password: ''
  }

  const handleKeyUp = ev => {
    state.password = ev.target.value
  }

  const createSpymaster = () => {
    props.mutate({
      variables: { password: state.password }
    }).then(() => {
      console.log("Created spymster")
    }).catch(() => console.log('Error making spymaster'))
  }

  return ce('span', { className: 'form-group card' },
    ce('h3', {}, 'Set Spymaster Password'),
    ce('input', { name: 'password',
      id: 'create-password',
      type: 'password',
      className: 'form-control',
      placeholder: 'Password',
      onKeyUp: ev => handleKeyUp(ev) }),
    ce('button', { className: 'btn btn-primary', id: 'create-password-button', onClick: createSpymaster }, 'Create Spymaster'),
  )
}

export default graphql(SetSpymasterMutation)(Create)
