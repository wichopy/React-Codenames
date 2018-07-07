var faker = require('faker');

class WordGrid {
  static _RandomNumber = (min, max) => {
    let randomNumber = Math.floor(Math.random() * max) + min;
    return randomNumber;
  }

  // default 5 x 5 grid
  static _uncoloredGrid = () => {
    let unindexedGridValues = Array(25).fill({ word: '', type: '', isSelectable: true });
    return unindexedGridValues.map((cell, index) => { return Object.assign({}, { index: index}, cell) });
  }

  static _setBackgrounds = (colorlessGrid, size) => {
    const gridValues = colorlessGrid;
    let populateCount = 0;

    //set red team
    for(let i = 0; i <= 8; i++){
      let newRandomPosition = WordGrid._RandomNumber(0, size * size - 1 - populateCount);
      gridValues[newRandomPosition].type = 'Red'
      populateCount++;
      gridValues.push(gridValues[newRandomPosition]);
      gridValues.splice(newRandomPosition, 1);
    }

    //set blue team
    for(let i = 0; i <= 7; i++){
      let newRandomPosition = WordGrid._RandomNumber(0, size * size - 1 - populateCount);
      gridValues[newRandomPosition].type = 'Blue'
      populateCount++;
      gridValues.push(gridValues[newRandomPosition]);
      gridValues.splice(newRandomPosition, 1);
    }

    // set assassin
    gridValues[0].type = 'Assassin';
    populateCount++;
    gridValues.push(gridValues[0]);
    gridValues.splice(0, 1);

    // set innocent peoples
    for(let i = 0; i <= 6; i++){
      let newRandomPosition = WordGrid._RandomNumber(0, size * size - 1 - populateCount);
      gridValues[newRandomPosition].type = 'Innocent'
      populateCount++;
      gridValues.push(gridValues[newRandomPosition]);
      gridValues.splice(newRandomPosition, 1);
    }

    return gridValues;
  }

  static generate = () => {
    let wordGrid = WordGrid._setBackgrounds(WordGrid._uncoloredGrid(), 5)

    for(let i = 0; i < wordGrid.length; i++) {
      let newWord = faker.random.word();
      wordGrid[i] = {...wordGrid[i], word: newWord };
    }

    return wordGrid.sort((a,b) => a.index - b.index);
  }

  static reshuffleCell = (wordGrid, index) => {
    const nextWordGrid = [...wordGrid]
    nextWordGrid[index] = {...wordGrid[index], word: faker.random.word()}
    return nextWordGrid
  }

  static displayWordGrid = (wordGrid, isSpymaster) => {
    let result = wordGrid
    if (!isSpymaster) {
      result = wordGrid.map(word => {
        if (word.isSelectable === false) {
          return word
        }
        return {...word, type: 'Hidden'}
      })
    }
    return result
  }
}

export default WordGrid
