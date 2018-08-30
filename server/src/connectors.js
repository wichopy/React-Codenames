
// TODO: Return promises so transition to persisted data is seamless.
class GameSessionStore {
  // Support in memory game sessions.
  // TODO: Persist game session data.
  gameSessions = { hello: {}}

  // Create a new game session and add to the gameSessions in memory cache
  createNewGame = (gameName, password, newGameSession) => {
    this.gameSessions[gameName] = {
      ...newGameSession,
      password,
    }
  }

  updateSessionState = (gameName, nextState) => {
    this.gameSessions[gameName] = {...this.gameSessions[gameName], ...nextState}
  }

  resetGame = (gameName, newGameSession) => {
    this.gameSessions[gameName] = newGameSession
  }

  // Retrieve a game session for resolvers to use.
  getSession = (gameName) => {
    return this.gameSessions[gameName]
  }
}

export {
  GameSessionStore
}
