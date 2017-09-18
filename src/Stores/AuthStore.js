import { observable } from 'mobx';

class AuthStore {
  @observable role = 'Player'
  @observable token = null

  cacheToken = (token) => {
    if (token !== null) {
      localStorage.setItem('token', token)
      this.setSpymaster(token)
      console.log('cachedtoken')
      return Promise.resolve()
    } else {
      console.log('login failed')
      return Promise.reject()
    }
  }

  setSpymaster = (token) => {
    console.log('set spymaster')
    this.token = token
    this.role = 'Spymaster'
  }

  setPlayer = () => {
    console.log('set player')
    this.token = null
    this.role = 'Player'
  }

  getToken = () => {
    let token = localStorage.getItem('token')
    if (token) {
      this.setSpymaster(token)
      return token
    }
    this.setPlayer()
    return
  }
}

export default AuthStore;
