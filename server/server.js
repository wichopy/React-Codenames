import express from 'express';
import { graphqlExpress,
  graphiqlExpress,
} from 'graphql-server-express';
import bodyParser from 'body-parser';
import { execute, subscribe, parse } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import cors from 'cors'
import jwt from 'express-jwt'

import { JWT_SECRET } from './config'

import { schema } from './src/schema';

const PORT = 4000;

const server = express();

const whitelist = ['http://www.willchou.ca/codenames', 'http://localhost:3000']

server.use('*', cors({ uri: whitelist[0] })
//  cors({ origin: (origin, callback) => {
//    if (whitelist.indexOf(origin) !== -1) {
//      callback(null,true)
//    } else {
//      callback(new Error('Not allowed by CORS'))
//    }
//  }})
);

const ws = createServer(server);

ws.listen(PORT, () => {
  console.log(`GraphQL WS Server running on port: ${PORT}`)

  const subServer = new SubscriptionServer({
    execute,
    subscribe,
    schema,
  }, {
    server: ws,
    path: '/subscriptions'
  })
})

server.get('/', function (req, res) {
  res.send('Codenames Server!');
});

// Using this tutorial on Medium by Simon Tucker
// https://medium.com/react-native-training/building-chatty-part-7-authentication-in-graphql-cd37770e5ab3
server.use('/graphql', bodyParser.json(),
// express-jwt will decode token and add its data to the req.user header.
  jwt({
    secret: JWT_SECRET,
    credentialsRequired: false,
  }),
// Define the context for this request to render user specific data.
  graphqlExpress(req => ({
  schema,
  context: {
    spymaster: req.user ? true : false }
  }))
);

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: 'ws://localhost:4000/subscriptions'
}))

// server.listen(PORT, () => console.log(`GraphQL Server is now running on http://localhost:${PORT}`));
