import WordGrid from '../Models/WordGrid';
describe( "WordGrid", () => {
  let wordGrid;

  beforeEach(() => {
    wordGrid = new WordGrid();
    wordGrid.generate()
  })
  it("Create a random 5x5 grid of words with randomized colors when instantiated", () => {
    expect(wordGrid.wordGrid.length).toEqual(25)
  })

  it("Can reshuffle words", ()=> {
    const oldWord = wordGrid.wordGrid[0]
    wordGrid.reshuffleCell(0)
    const newWord = wordGrid.wordGrid[0]
    expect(oldWord === newWord).toBeFalsy()
  })
})
