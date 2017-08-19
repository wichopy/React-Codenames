class TurnsManager {
  state = {
    currentTurn: 'Red',
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

    if (type != this.state.currentTurn) {
      // Switch turns
      console.log("i should switch the turns")
      this.state.currentTurn = type
    }
    //Do nothing
  }
}

export default new TurnsManager()
