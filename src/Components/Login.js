import { createElement as ce } from 'react';
import { graphql } from 'react-apollo';

import { LoginAsSpymasterMutation } from './gqlCalls';
import AuthService from '../Services/AuthService'
const Login = (props) => {
  const state = {
    password: ''
  }

  const handleKeyUp = ev => {
    state.password = ev.target.value
  }

  const handleLogin = () => {
    console.log('loggin in...')
      props.mutate({
        variables: { password: state.password },
      }).then(token => {
        AuthService.cachetoken(token.data.loginAsSpymaster)
        return
      }).then( () => {
        props.callbacks.WordCellGridRefetch()
        return
      }).catch(err => {
      console.log(err)
    })
  }

  return ce('span', { className: 'form-group card' },
    ce('h3', {}, 'Access spymaster view'),
    ce('input', { name: 'password',
      type: 'password',
      className: 'form-control',
      placeholder: 'Password',
      onKeyUp: ev => handleKeyUp(ev) }),
    ce('button', { className: 'btn btn-primary', onClick: handleLogin }, 'View as Spymaster'),
  )
}

export default graphql(LoginAsSpymasterMutation)(Login)
