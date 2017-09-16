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

import Scoreboard from './Models/Scoreboard';
import TurnsManager from './Models/turnsManager';
import WordCellGrid from './Components/WordGrid/WordCellGrid';
import CluesFeed from './Components/CluesFeed'
import SkipTurnButton from './Components/SkipButtonWithConfirmation'
import CreateSpymaster from './Components/Auth/Create'
import LoginAsSpymaster from './Components/Auth/Login'
import AuthService from './Services/AuthService'
import NewGameWrapper from './Components/NewGameWrapper'
import CheckboxWordReshuffle from './Components/CheckboxWordReshuffle'
import NewGame from './Components/NewGame'

const wsClient = new SubscriptionClient(`ws://localhost:4000/subscriptions`, {
// const wsClient = new SubscriptionClient(`ws://willchou.ca/subscriptions`, {
  reconnect: true,
});

const networkInterface = createNetworkInterface({ uri: 'http://localhost:4000/graphql'})
// const networkInterface = createNetworkInterface({ uri: 'http://willchou.ca/graphql'})

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
    token: AuthService.getToken(),
    enableReshuffle: false,
    gameId: ''
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
    if (this.state.token && event && event.code === "KeyE") {
      this.handleEnableShuffleCheckbox()
    }
  }
  componentDidMount() {
    console.log('App mounted.')
    addAuthListener('authenticated', this.listenForAuth)
  }

  listenForAuth = () => {
    this.setState({ token: AuthService.getToken() })
  }

  handleEnableShuffleCheckbox = () => {
    this.setState({ enableReshuffle: ! this.state.enableReshuffle })
  }

  render() {
    const { token, enableReshuffle, callbacks } = this.state
    const { handleEnableShuffleCheckbox } = this
    return (
      ce(ApolloProvider, { client },
        ce('div', { className: 'App' },
          ce('div', { className: 'container' },

            ce(ToastrContainer, {}),
            ce('div', { className: 'row'}, 
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
                ce(WordCellGrid, { callbacks, enableReshuffle, token }),
                ce(SkipTurnButton, {}),
                ce(NewGameWrapper, {}),
              ),
              ce('div', { className: 'col-lg-4 col-xs-12' },
                token ? '' : ce(CreateSpymaster),
                token ? '' : ce(LoginAsSpymaster, { callbacks: this.state.callbacks }),
                token ? ce(CheckboxWordReshuffle, { enableReshuffle, handleEnableShuffleCheckbox }) : '',
                ce(CluesFeed, { token },)
              ),
            ),
          ),
        ),
      )
    );
  }
}

export default keydown(App);
