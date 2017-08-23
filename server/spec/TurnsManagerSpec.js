import TurnsManager from '../Models/TurnsManager';
describe( "TurnsManager", () => {
  
  let turnsManager;
  
  beforeEach(() => {
    turnsManager = new TurnsManager();
  });

  it("Can switch turns", () => {
    expect(turnsManager.state.currentTurn).toEqual('Red');

    turnsManager.switchTurn()

    expect(turnsManager.state.currentTurn).toEqual('Blue')
  })

  it("Can end turns when all clues are used and resets its state.", () => {
    turnsManager.state.numberOfClues = 4;
    turnsManager.state.numberOfGuesses = 4;

    turnsManager.EndTurnAfterGuessingAllClues();

    expect(turnsManager.state.numberOfClues == 0)
    expect(turnsManager.state.numberOfGuesses == 0)
    expect(turnsManager.state.guessedAllClues == true)
    expect(turnsManager.state.currentTurn === 'Blue')
  })

  it("Can declare the winner of the game", () => {
    expect(turnsManager.winner === '');
    turnsManager.declareWinner('Blue');
    expect(turnsManager.state.winner === 'Blue');
  })
})

