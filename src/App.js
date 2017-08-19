import React, { createElement as ce } from 'react';
import './App.css';
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
} from 'react-apollo';

// import { typeDefs } from './schema';

import Scoreboard from './Models/Scoreboard';
import TurnsManager from './Models/turnsManager';
import WordCellGrid from './Components/WordCellGrid';
const networkInterface = createNetworkInterface({ uri: '/graphql'})
networkInterface.use([{
  applyMiddleware(req,next) {
    setTimeout(next, 500);
  },
}]);
const client = new ApolloClient({ networkInterface });

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

const initialState = () => {
  return {
    users: [],
    size: 5,
    gridValues: [],
    currentTurn: 'Red',
    score: {
      Red: 0,
      Blue: 0,
    }
  }
};

class App extends React.Component {
  state = initialState();

  componentDidMount() {
    console.log('App mounted.')
  }

  swtchTurns = () => {
    TurnsManager.switchTurn();
    this.setState({ currentTurn: TurnsManager.state.currentTeamTurn });
  }
  
  render() {
    const { currentTurn, score } = this.state;
    return (
      ce(ApolloProvider, { client },
        ce('div', { className: 'App' },
          ce('div', { className: 'container' },
            ce('div', { className: 'row'},
              ce('div', { className: 'col-3' }),
              ce(Scoreboard, {}),
              ce('div', { className: 'col-3' }),
              ce('div', { className: 'col-2' }, 'Current Team\'s Turn: ' + currentTurn),
              ce('div', { className: 'col-8' },
                ce(WordCellGrid, {}),
              ),
              ce('div', { className: 'col-2' },
                ce('button', { onClick: () => this.swtchTurns() }, 'Next Turn'),
              ),
            ),
          ),
        ),
      )
    );
  }
}

export default App;
