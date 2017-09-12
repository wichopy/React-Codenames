class Cluesfeed {
  cluesFeed = []

  addToCluesFeed = (clue) => { 
    this.cluesFeed.unshift(clue)
  }

  reset = () => {
    this.cluesFeed = []
  }
}

export default Cluesfeed
