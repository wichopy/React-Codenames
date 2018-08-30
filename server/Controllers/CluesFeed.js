class Cluesfeed {
  static generate = () => []

  static addToCluesFeed = (cluesFeed, clue) => {
    const nextCluesFeed = [...cluesFeed]
    nextCluesFeed.unshift(clue)
    return nextCluesFeed
  }

  static reset = (cluesFeed) => {
    let nextCluesFeed = [...cluesFeed]
    nextCluesFeed = []
    return nextCluesFeed
  }
}

export default Cluesfeed
