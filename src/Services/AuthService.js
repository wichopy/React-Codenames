

class AuthService {
  role = 'Player'

  cachetoken = (token) => {
    localStorage.setItem('token', token)
    this.role = 'Spymaster'
    console.log('cachedtoken')
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