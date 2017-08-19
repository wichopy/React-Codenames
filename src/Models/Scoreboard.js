import { Component, createElement as ce } from 'react';
import { graphql } from 'react-apollo';
import { ScoreboardQuery } from '../Components/gqlCalls';

const Scoreboard = ({ data }) => {
  let {loading, error, score } = data
  if (loading) {
    return ce('p', {}, 'Loading...')
  }
  if (error) {
    return ce('p', {}, error.message)
  }
  return ce('div', { className: 'row' },
    ce('div', { className: 'col-6' },
      'Red Team - ' + score.Red,
    ),
    ce('div', { className: 'col-6' },
      'Blue Team - ' + score.Blue,
    )
  )
}

const ScoreboardWithData = graphql(ScoreboardQuery, {
  options: { pollInterval: 5000 },
})(Scoreboard);
export default ScoreboardWithData;
