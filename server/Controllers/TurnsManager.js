const defaultState = {
  currentTurn: 'Red',
  winner: '',
  numberOfClues: 0,
  numberOfGuesses: 0,
  nextTurn: 'Blue',
  guessedAllClues: false
}

class TurnsManager {
  static generate = () => ({
    currentTurn: 'Red',
    winner: '',
    numberOfClues: 0,
    numberOfGuesses: 0,
    nextTurn: 'Blue',
    guessedAllClues: false
  })

  state = defaultState

  reset = () => {
    this.state = defaultState
  }

  static declareWinner(turnsManager, team) {
    const nextGameSession = {...turnsManager}
    nextGameSession.winner = team

    return nextGameSession
  }

  listenToClues = (clues) => {
    this.state.numberOfClues = clues
    console.log(`Update number of clues to watch to ${clues}`)
    this.state.guessedAllClues = false
    this.endTurnAfterGuessingAllClues()
  }

  listenToGuesses = () => {
    this.state.numberOfGuesses ++
    console.log('Guessed a word.')
    this.endTurnAfterGuessingAllClues()
  }

  endTurnAfterGuessingAllClues = () => {
    console.log(`${this.state.numberOfGuesses} == ${this.state.numberOfClues}`)
    if (this.state.numberOfGuesses == this.state.numberOfClues) {
      console.log("Used all guesses, end turn!")
      this.state.guessedAllClues = true
      this.switchTurn()
    }
  }

  static switchTurn = (turnsManager) => {
    const nextTurnsManager = { ...turnsManager }
    let tempTurnKeeper = nextTurnsManager.currentTurn
    nextTurnsManager.currentTurn = nextTurnsManager.nextTurn
    nextTurnsManager.nextTurn = tempTurnKeeper
    nextTurnsManager.numberOfGuesses = 0
    nextTurnsManager.numberOfClues = 0

    return nextTurnsManager
  }

  static increaseNumberOfGuesses = (turnsManager) => {
    const nextTurnsManager = {...turnsManager}
    nextTurnsManager.numberOfGuesses ++

    return nextTurnsManager
  }

  static wordSelected(type) {
    if (type == 'Innocent') {
      // Do nothing.
      return
    }

    if (type == 'Assassin') {
      // End game, Other team wins
      // BUG: Not declaring winner properly on a assassin lose.
      if (this.state.currentTurn == 'Red') {
        if (this.state.guessedAllClues) {
          this.declareWinner('Red')
        }
        this.declareWinner('Blue')
      }
      if (this.state.currentTurn == 'Blue') {
        if (this.state.guessedAllClues) {
          this.declareWinner('Blue')
        }
        this.declareWinner('Red')
      }
      return 'endGame'
    }

    if (type !== this.state.currentTurn && !this.state.guessedAllClues) {
      // Switch turns
      console.log('Woopse guessed word for other team, switch turns')
      this.switchTurn()
    }
    //Do nothing
  }
}

export default TurnsManager;
