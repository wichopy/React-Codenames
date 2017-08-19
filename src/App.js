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

class App extends React.Component {

  componentDidMount() {
    console.log('App mounted.')
  }
  
  render() {
    return (
      ce(ApolloProvider, { client },
        ce('div', { className: 'App' },
          ce('div', { className: 'container' },
            ce('div', { className: 'row'},
              ce('div', { className: 'col-3' }),
              ce(Scoreboard, {}),
              ce('div', { className: 'col-3' }),
              ce(TurnsManager, {}),
              ce('div', { className: 'col-8' },
                ce(WordCellGrid, {}),
              ),
              ce('div', { className: 'col-2' }),
            ),
          ),
        ),
      )
    );
  }
}

export default App;
