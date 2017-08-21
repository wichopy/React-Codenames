import TurnsManager from '../Models/TurnsManager';
describe( "TurnsManager", () => {
  const turnsManager = new TurnsManager();

  it("Can switch turns", () => {
    expect(turnsManager.state.currentTurn).toEqual('Red');

    turnsManager.switchTurn()

    expect(turnsManager.state.currentTurn).toEqual('Blue')
  })
})