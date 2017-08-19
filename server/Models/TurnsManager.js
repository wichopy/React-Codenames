class TurnsManager {
  state = {
    currentTurn: 'Red',
    numberOfClues: 0,
    numberOfGuesses: 0,
    nextTurn: 'Blue',
    guessedAllClues: false
  }

  listenToClues = (clues) => {
    this.state.numberOfClues = clues
    console.log(`Update number of clues to watch to ${clues}`)
    this.state.guessedAllClues = false
    this.EndTurnAfterGuessingAllClues()
  }

  listenToGuesses = () => {
    this.state.numberOfGuesses ++
    console.log('Guessed a word.')
    this.EndTurnAfterGuessingAllClues()
  }

  EndTurnAfterGuessingAllClues = () => {
    console.log(`${this.state.numberOfGuesses} == ${this.state.numberOfClues}`)
    if (this.state.numberOfGuesses == this.state.numberOfClues) {
      console.log("Used all guesses, end turn!")
      this.state.guessedAllClues = true
      this.switchTurn()
    }
  }

  switchTurn = () => {
    let tempTurnKeeper = this.state.currentTurn
    this.state.currentTurn = this.state.nextTurn
    this.state.nextTurn = tempTurnKeeper
    this.state.numberOfGuesses = 0
    this.state.numberOfClues = 0
  }

  wordSelected(type) {
    if (type == 'Innocent') {
      // Do nothing.
      return
    }

    if (type == 'Assassin') {
      // End game, Other team wins
      if (state.currentTurn == 'Red') {
        //Blue wins
      }
      if (state.currentTurn == 'Blue') {
        //Red wins
      }
      return // Some winning notification.
    }

    if (type != this.state.currentTurn && !this.state.guessedAllClues) {
      // Switch turns
      console.log('Woopse guessed word for other team, switch turns')
      this.switchTurn()
    }
    //Do nothing
  }
}

export default new TurnsManager()
