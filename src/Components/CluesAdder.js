import { Component, createElement as ce } from 'react';
import { graphql } from 'react-apollo';
import { CluesfeedQuery, AddClueMutation, CurrentClueQuery } from './gqlCalls'
import { ToastDanger } from 'react-toastr-basic'

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
    if (clue.hint === '' || clue.associated === 0) {
      return
    }
      
    this.props.mutate({
      variables: clue,
      refetchQueries: [ { query: CluesfeedQuery }, { query: CurrentClueQuery }]
    }).then((res) => {
      if (res.data.addClue.maxClues) {
        ToastDanger(`Too many associated words! Reduce the number to less then ${res.data.addClue.maxClues}`)
      }
    });
  }

  render() {
    let { handleSubmit, handleKeyUp } = this

    return ce('span', { className: 'form-group'},
      ce('input', { name: 'hint', type: "text", className: 'form-control', placeholder: 'New Clue', onKeyUp: handleKeyUp }),
      ce('input', { name: 'associated', type: "number", className: 'form-control', placeholder: 'Goes with this number words', onKeyUp: handleKeyUp }),
      ce('button', { className: 'btn', onClick: handleSubmit }, 'Add Clue'),
    );
  }
};

const SelectWordWithMutation = graphql(AddClueMutation)(CluesAdder);

export default SelectWordWithMutation;
