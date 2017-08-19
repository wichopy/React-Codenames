import { Component, createElement as ce } from 'react';
import { graphql } from 'react-apollo';
import { CluesfeedQuery, AddClueMutation } from './gqlCalls'

class CluesAdder extends Component {

  state = {
    hint: '',
    associated: 0,
  }
  //TODO: Make it a single text box and regex. For now, 2 textboxes with a button to submit.
  handleKeyUp = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit = () => {
    const clue = {
      hint: this.state.hint,
      associated: this.state.associated
    }
    this.props.mutate({
      variables: clue,
      refetchQueries: [ { query: CluesfeedQuery }]
    }).then( res => console.log(res));
  }

  render() {
    let { handleSubmit, handleKeyUp } = this

    return ce('span', {},
      ce('input', { name: 'hint', type: "text", placeholder: 'New Clue', onKeyUp: handleKeyUp }),
      ce('input', { name: 'associated', type: "number", placeholder: 'Goes with this number words', onKeyUp: handleKeyUp }),
      ce('button', { onClick: handleSubmit }, 'Add Clue'),
    );
  }
};

const SelectWordWithMutation = graphql(AddClueMutation)(CluesAdder);

export default SelectWordWithMutation;
