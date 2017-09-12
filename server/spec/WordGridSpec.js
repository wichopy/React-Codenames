import WordGrid from '../Models/WordGrid';
describe( "WordGrid", () => {
  let wordGrid;

  beforeEach(() => {
    wordGrid = new WordGrid();
    wordGrid.generate()
  })
  it("Creates a random 5x5 grid of words", () => {
    expect(wordGrid.wordGrid.length).toEqual(25)
  })

  it("Can reshuffle words", ()=> {
    const oldWord = wordGrid.wordGrid[0].word
    wordGrid.reshuffleCell(0)
    const newWord = wordGrid.wordGrid[0].word
    expect(oldWord === newWord).toBeFalsy()
  })
})
