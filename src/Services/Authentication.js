import jwtDecode from 'jwt-decode'
import gql from 'graphql-tag';
import ApolloClient, { createNetworkInterface } from 'apollo-client';

class Role {
  spymaster = false
  subscribers = {}

  broadcast = (key) => {
    this.subscribers[key](this[key])
  }

  subscribe = (key, callback) => {
    console.log(callback)
    console.log('subscribing callback')
    this.subscribers[key] = callback
  }

  stateChange = (key, payload) => {
    this[key] = payload
    this.broadcast(key)
  }
  setRole = () => {
    let token = JSON.parse(localStorage.getItem('JWTtoken'))
    if (token !== null) {
      console.log("Set role as spymaster.")
      console.log(token)
      console.log( jwtDecode(token.loginAsSpymaster.token))
      this.stateChange('spymaster', jwtDecode(token.loginAsSpymaster.token).spymaster)
      console.log(this.spymaster)
    } else {
      console.log("Client is a player.")
    }
  }

  getRole = () => {
    return this.spymaster
  }

  fetchToken = () => {

  }

  cacheToken = ({data}) => {
    let jsonString = JSON.stringify(data)
    console.log(jsonString)
    localStorage.setItem('JWTtoken', jsonString)
    let decodedJWT = jwtDecode(data.loginAsSpymaster.token)
    this.spymaster = decodedJWT.spymaster
    console.log(decodedJWT)
  }

  verifyToken = (token) => {
    // Verify a stringified JWT
    const client = new ApolloClient({
      networkInterface: createNetworkInterface({
        uri: '/graphql'
      }),
    })
    let jsonString = JSON.stringify(token)
    client.query({
      query: gql`
        query {
          verifySpymaster(token: ${jsonString}) 
        }
      `
    }).then(res => console.log(res))
  }

}

export default new Role()
