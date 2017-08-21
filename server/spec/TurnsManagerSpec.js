describe( "TurnsManager", function() {
  var turnsManager = require('../Models/TurnsManager');

  it("Can switch turns", function() {
    expect(turnsManager.state.currentTurn).toEqual('Red');

    turnsManager.switchTurn()

    expect(turnsManager.state.currentTurn).toEqual('Blue')
  })
})