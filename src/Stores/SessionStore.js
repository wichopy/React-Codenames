import { observable } from 'mobx'

class SessionStore {
  @observable gameId = null

  getGameId() {
    let gameId = localStorage.getItem('gameId')
    this.gameId = gameId
    return gameId
  }

  setGameId(gameId) {
    localStorage.setItem('gameId', gameId)
    this.gameId = gameId
  }
}

export default SessionStore;
