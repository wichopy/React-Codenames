import { createElement as ce } from 'react';
import { graphql } from 'react-apollo';
import { SkipTurnMutation, CurrentTurnQuery } from './gqlCalls';

const skipTurnButton = (props) => {
  const handleSkip = () => {
    props.mutate({
      refetchQueries: [ { query: CurrentTurnQuery }]
    })
  }

  return ce('button', { className: 'btn', onClick: handleSkip }, 'Skip Turn')
};

const SkipTurnWithMutation = graphql(SkipTurnMutation)(skipTurnButton);

export default SkipTurnWithMutation;
