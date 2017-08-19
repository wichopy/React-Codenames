import { Component, createElement as ce } from 'react';

import { graphql } from 'react-apollo';
import { SkipTurnMutation, CurrentTurnQuery } from './gqlCalls';

class SkipButtonWithConfirmation extends Component{
  state = {
    confirmation: false
  }

  toggle = () => {
    console.log("Toggle Modal")
    this.setState({
      confirmation: !this.state.confirmation
    })
  }

  handleSkip = () => {
    this.props.mutate({
      refetchQueries: [ { query: CurrentTurnQuery }]
    }).then( () => this.toggle() )
  }

  render() {
    return ce('div', {},
      this.state.confirmation ? 
      ce('div', {},
        ce('h3', {}, 'Are you sure you want to skip?'),
        ce('span', {},
          ce('button', { className: 'btn btn-danger', onClick: this.handleSkip }, 'Yes'),
          ce('button', { className: 'btn btn-secondary', onClick: this.toggle }, 'No')
        ),
      )
      : ce('button', { className: 'btn', onClick: () => this.toggle() }, 'Skip Turn')
    )
  }
};

const SkipTurnWithMutation = graphql(SkipTurnMutation)(SkipButtonWithConfirmation);

export default SkipTurnWithMutation;
