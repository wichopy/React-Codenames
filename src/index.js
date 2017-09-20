import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as MobxProvider } from 'mobx-react'

import { SubscriptionClient } from 'subscriptions-transport-ws';
import { addGraphQLSubscriptions } from 'add-graphql-subscriptions'
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
} from 'react-apollo';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';

import ModifierStore from './Stores/ModifierStore'
import AuthStore from './Stores/AuthStore'
import SessionStore from './Stores/SessionStore'

const authStore = new AuthStore();
authStore.getToken();
const modifierStore = new ModifierStore();
const sessionStore = new SessionStore();
sessionStore.getGameId()

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

// Wrap the app with stores and apollo's network client.
ReactDOM.render(
  <MobxProvider 
    authStore={authStore}
    modifierStore={modifierStore}
    sessionStore={sessionStore} >
    <ApolloProvider client={client} >
      <App />
    </ApolloProvider>
  </MobxProvider>,
  document.getElementById('root'));
registerServiceWorker();
