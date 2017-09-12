const defaultState = {
  currentTurn: 'Red',
  winner: '',
  numberOfClues: 0,
  numberOfGuesses: 0,
  nextTurn: 'Blue',
  guessedAllClues: false
}

class TurnsManager {

  state = defaultState

  reset = () => {
    this.state = defaultState
  }

  declareWinner(team) {
    this.state.winner = team
    console.log(`Winning team is: ${team}`)
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
