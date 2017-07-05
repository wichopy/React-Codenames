class TurnsManager {
  state = {
    currentTeamTurn: 'Red',
  }

  switchTurn = () => {
    if (this.state.currentTeamTurn === 'Red') {
      this.state.currentTeamTurn = 'Blue';
    } else {
      this.state.currentTeamTurn = 'Red';
    }
  }
}

export default new TurnsManager();
