class Cluesfeed {
  cluesFeed = []
  addToCluesFeed = (clue) => { 
    this.cluesFeed.unshift(clue)
  }
  resetCluesFeed = () => {
    this.cluesFeed = []
  }
}

export default Cluesfeed
