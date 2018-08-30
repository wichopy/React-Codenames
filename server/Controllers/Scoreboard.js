class Scoreboard {
  static generate = () => (
    {
      Red: 0,
      Blue: 0,
    }
  )

  static incrementBlue = (scoreBoard) => {
    const nextScoreboard = {...scoreBoard}
    nextScoreboard.Blue ++
    return nextScoreboard
  }

  static incrementRed = (scoreBoard) => {
    const nextScoreboard = {...scoreBoard}
    nextScoreboard.Red ++
    return nextScoreboard
  }

  static reset = (scoreBoard) => {
    const nextScoreBoard = {...scoreBoard}
    nextScoreBoard.Red = 0
    nextScoreBoard.Blue = 0
    return nextScoreBoard
  }
}

export default Scoreboard
