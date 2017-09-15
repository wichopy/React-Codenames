import React, { createElement as ce } from 'react';
import ToastrContainer from 'react-toastr-basic'
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
} from 'react-apollo';
import './App.css';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { addGraphQLSubscriptions } from 'add-graphql-subscriptions'

import Scoreboard from './Models/Scoreboard';
import TurnsManager from './Models/turnsManager';
import WordCellGrid from './Components/WordCellGrid';
import CluesFeed from './Components/CluesFeed'
import SkipTurnButton from './Components/SkipButtonWithConfirmation'
import CreateSpymaster from './Components/Create'
import LoginAsSpymaster from './Components/Login'
import AuthService from './Services/AuthService'
import NewGameWrapper from './Components/NewGameWrapper'

const wsClient = new SubscriptionClient(`ws://willchou.ca/subscriptions`, {
  reconnect: true,
});

const networkInterface = createNetworkInterface({ uri: 'http://willchou.ca/graphql'})

const authCallbacks = {};
const addAuthListener = (key, callback) => {
  authCallbacks[key] = callback
}
networkInterface.use([{
  applyMiddleware(req,next) {
    let token = AuthService.getToken()
    if (!req.options.headers) {
      req.options.headers = {}
    }
    if (token) {
      Object.keys(authCallbacks).forEach(key => authCallbacks[key]() )
      req.options.headers.authorization = `Bearer ${token}`
    }
    next()
  },
}]);

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
);

const client = new ApolloClient({ networkInterface: networkInterfaceWithSubscriptions });

class App extends React.Component {
  state = {
    callbacks: {},
    token: AuthService.getToken()
  }

  componentDidMount() {
    console.log('App mounted.')
    addAuthListener('authenticated', this.listenForAuth)
  }

  listenForAuth = () => {
    this.setState({ token: AuthService.getToken() })
  }

  render() {
    let { token } = this.state
    return (
      ce(ApolloProvider, { client },
        ce('div', { className: 'App' },
          ce('div', { className: 'container' },

            ce(ToastrContainer, {}),

            ce('div', { className: 'row'},
              ce('div', { className: 'col-lg-6 col-xs-8' },
                ce(Scoreboard, {})
              ),
              ce('div', { className: 'col-lg-6 col-xs-4' },
                ce(TurnsManager, {}),
              )
            ),

            ce('div', { className: 'row'},
              ce('div', { className: 'col-lg-8 col-xs-12' },
                ce(WordCellGrid, { callbacks: this.state.callbacks }),
                ce(SkipTurnButton, {}),
                ce(NewGameWrapper, {}),
              ),
              ce('div', { className: 'col-lg-4 col-xs-12' },
                token ? '' : ce(CreateSpymaster),
                token ? '' : ce(LoginAsSpymaster, { callbacks: this.state.callbacks }),
                ce(CluesFeed, { token },)
              ),
            ),
          ),
        ),
      )
    );
  }
}

export default App;
