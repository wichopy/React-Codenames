class Scoreboard {
  defaultScore = {
    Red: 0,
    Blue: 0,
  }

  state = {
    score: this.defaultScore,
  }

  pointsAdder = (team) => {
    this.state.score[team]++;
  }
}

export default new Scoreboard();
