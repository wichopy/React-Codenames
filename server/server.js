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
import { required } from 'glamor';

const PORT = 4000;

const server = express();
server.use('*', cors({ origin: 'http://localhost:3000' }));

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

server.use(function (req, res, next) {
  console.log(req.headers.gamename)
  next()
})

// Using this tutorial on Medium by Simon Tucker
// https://medium.com/react-native-training/building-chatty-part-7-authentication-in-graphql-cd37770e5ab3
server.use('/graphql', bodyParser.json(),
// express-jwt will decode token and add its data to the req.user header.
  jwt({
    secret: JWT_SECRET,
    credentialsRequired: false,
  }),
// Define the context for this request to render user specific data.
  graphqlExpress(req => {
    return ({
      schema,
      context: {
        gameName: req.headers.gamename,
        spymaster: req.user ? true : false
      }
    })
  })
);

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: 'ws://localhost:4000/subscriptions'
}))

// server.listen(PORT, () => console.log(`GraphQL Server is now running on http://localhost:${PORT}`));
