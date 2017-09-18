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
import keydown from 'react-keydown';
import { observer } from 'mobx-react'

import Scoreboard from './Models/Scoreboard';
import TurnsManager from './Models/turnsManager';
import WordCellGrid from './Components/WordGrid/WordCellGrid';
import CluesFeed from './Components/Clues/CluesFeed'
import SkipTurnButton from './Components/SkipButtonWithConfirmation'
import CreateSpymaster from './Components/Auth/Create'
import LoginAsSpymaster from './Components/Auth/Login'
import NewGameWrapper from './Components/NewGameWrapper'
import CheckboxWordReshuffle from './Components/CheckboxWordReshuffle'
import ViewingAs from './Components/ViewingAs'
import NewGame from './Components/NewGame'

import ModifierStore from './Stores/ModifierStore'
import AuthStore from './Stores/AuthStore'

let authStore = new AuthStore();
authStore.getToken();
let modifierStore = new ModifierStore();

const wsClient = new SubscriptionClient(`ws://localhost:4000/subscriptions`, {
// const wsClient = new SubscriptionClient(`ws://willchou.ca/subscriptions`, {
  reconnect: true,
});

const networkInterface = createNetworkInterface({ uri: 'http://localhost:4000/graphql'})
// const networkInterface = createNetworkInterface({ uri: 'http://willchou.ca/graphql'})


networkInterface.use([{
  applyMiddleware(req,next) {
    let token = authStore.getToken()
    if (!req.options.headers) {
      req.options.headers = {}
    }
    if (token) {
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

@keydown
class App extends React.Component {
  state = {
    gameId: '',
  }

  getGameId() {
    let gameId = localStorage.getItem('gameId')
    return gameId
  }

  setGameId(gameId) {
    localStorage.setItem('gameId', gameId)
  }

  componentWillReceiveProps( nextProps ) {
    const { keydown: { event } } = nextProps
    if (authStore.token && event && event.code === "KeyE") {
      modifierStore.handleEnableReshuffle()
    }
  }

  componentDidMount() {
    console.log('App mounted.')
  }

  render() {
    return (
      ce(ApolloProvider, { client },
        ce('div', { className: 'App' },
          ce('div', { className: 'container' },

            ce(ToastrContainer, {}),
            ce('div', { className: 'row'}, 
              ce(ViewingAs, { authStore }),
              ce(NewGame, {})
            ),
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
                ce(WordCellGrid, { authStore, modifierStore }),
                ce(SkipTurnButton, {}),
                ce(NewGameWrapper, {}),
              ),
              ce('div', { className: 'col-lg-4 col-xs-12' },
                ce(CreateSpymaster, { authStore }),
                ce(LoginAsSpymaster, { authStore }),
                ce(CheckboxWordReshuffle, { authStore, modifierStore }),
                ce(CluesFeed, { authStore },)
              ),
            ),
          ),
        ),
      )
    );
  }
}

export default App;
