import { createElement as ce } from 'react';
import { graphql } from 'react-apollo';
import { SetSpymasterMutation } from './gqlCalls'

const createSpymaster = (props) => {
  const state = {
    password: ''
  }

  const handleKeyUp = (ev) => {
    console.log(ev.target.value)
    state.password = ev.target.value
    // state.password = ev.tartget.value
  }

  const handleSubmit = () => {
    console.log(state)
    props.mutate({
      variables: { password: state.password }
    }).then(res => console.log(res))
  }

  return ce('span', { className: 'form-group card'},
    ce('h3', {}, 'Create a spymaster password'),
    ce('input', { name: 'password', className: 'form-control', onKeyUp: ev => handleKeyUp(ev) }),
    ce('button', { className: 'btn', onClick: () => handleSubmit() }, 'Create Spymaster password'),
  )
}

export default graphql(SetSpymasterMutation)(createSpymaster)
