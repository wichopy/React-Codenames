

class AuthService {
  role = 'Player'

  cachetoken = (token) => {
    if (token !== null) {
      localStorage.setItem('token', token)
      this.role = 'Spymaster'
      console.log('cachedtoken')
      return Promise.resolve()
    } else {
      console.log('login failed')
      return Promise.reject()
    }
  }

  getToken = () => {
    let token = localStorage.getItem('token')
    if (token) {
      this.role = 'Spymaster'
      return token
    }
    return
  }
}

export default new AuthService()
