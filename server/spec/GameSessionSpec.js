import GameSession from '../Models/GameSession'

describe( "GameSession", () => {
  let gameSession

  beforeEach( () => {
    gameSession = new GameSession('test');
  })

  it("Creates a default game state on instantiation.", () => {
    expect(gameSession.gameId).toEqual('test')
    expect(gameSession.scoreBoard.Red === 0).toBeTruthy()
    expect(gameSession.scoreBoard.Blue === 0).toBeTruthy()
  })
})
