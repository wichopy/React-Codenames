import Scoreboard from '../Controllers/Scoreboard'

describe('Scoreboard Controller', () => {
  const scoreBoard = {
    Red: 0,
    Blue: 0,
  }

  it('can generate a new scoreboard', () => {
    expect(Scoreboard.generate()).toEqual(scoreBoard)
  })

  it('can increment the blue score', () => {
    expect(Scoreboard.incrementBlue(scoreBoard)).toEqual({
      Red: 0,
      Blue: 1,
    })
  })

  it('can increment the red score', () => {
    expect(Scoreboard.incrementRed(scoreBoard)).toEqual({
      Red: 1,
      Blue: 0,
    })
  })
})
