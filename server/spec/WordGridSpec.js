import WordGrid from '../Controllers/WordGrid';
describe( "WordGrid Controller", () => {

  it("Creates a random 5x5 grid of words", () => {
    expect(WordGrid.generate().length).toEqual(25)
  })

  it('can reshuffle a word', () => {
    expect(WordGrid.reshuffleCell(['word', 'word'], 1)[1] !== 'word').toBeTruthy
  })

  const wordGrid = [{
    index: 0,
    type: 'Blue',
    word: 'banana',
    isEnabled: true,
  }, {
    index: 1,
    type: 'Red',
    word: 'peach',
    isEnabled: true,
  }]

  it('should hide the word cell type if the user is not the spymaster', () => {
    expect(WordGrid.displayWordGrid(wordGrid, false)[0].type).toEqual('Hidden')
  })

  it('should show the word cell type if the user is the spymaster', () => {
    expect(WordGrid.displayWordGrid(wordGrid, true)[0].type).toEqual('Blue')
  })

})
