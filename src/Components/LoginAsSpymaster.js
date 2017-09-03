import { createElement as ce } from 'react';
import { graphql } from 'react-apollo';
import jwtDecode from 'jwt-decode';

import { loginAsSpymaster } from './gqlCalls'
import Role from '../Services/Authentication'

const LoginAndDelete = (props) => {
  const state = {
    password: ''
  }

  const handleKeyUp = (ev) => {
    state.password = ev.target.value
    // state.password = ev.tartget.value
  }

  const handleLogin = () => {
    props.mutate({
      variables: { password: state.password }
    }).then(token => {
      console.log(token)
      Role.cacheToken(token)
    })
  }

  const handleDelete = () => {
    // props.mutate({
    //   variables: { password: state.password }
    // }).then(res => console.log(` I should delete things here...`))
    console.log(` I should delete things here...`)
  }

  return ce('span', { className: 'form-group card'},
    ce('h3', {}, 'Access spymaster view'),
    ce('input', { name: 'password', type: "password", className: 'form-control', placeholder: 'Password', onKeyUp: ev => handleKeyUp(ev) }),
    ce('button', { className: 'btn btn-primary', onClick: handleLogin }, 'View as Spymaster'),
    ce('button', { className: 'btn btn-danger', onClick: handleDelete }, 'Delete Spymaster'),
  )
}

export default graphql(loginAsSpymaster)(LoginAndDelete)
