var faker = require('faker');

const RandomNumber = (min, max) => {
  let randomNumber = Math.floor(Math.random() * max) + min;
  return randomNumber;
}

// default 5 x 5 grid
const unindexedGridValues = Array(25).fill({ word: '', type: '', isEnabled: true });
const uncoloredGrid = unindexedGridValues.map((cell, index) => { return Object.assign({}, { index: index}, cell) });

const setBackgrounds = (colorlessGrid, size) => {
  const gridValues = colorlessGrid.concat();
  let populateCount = 0;

  //set red team 
  for(let i = 0; i <= 8; i++){
    let newRandomPosition = RandomNumber(0, size * size - 1 - populateCount);
    gridValues[newRandomPosition].type = 'Red'
    populateCount++;
    gridValues.push(gridValues[newRandomPosition]);
    gridValues.splice(newRandomPosition, 1);
  }

  //set blue team
  for(let i = 0; i <= 7; i++){
    let newRandomPosition = RandomNumber(0, size * size - 1 - populateCount);
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
    let newRandomPosition = RandomNumber(0, size * size - 1 - populateCount);
    gridValues[newRandomPosition].type = 'Innocent'
    populateCount++;
    gridValues.push(gridValues[newRandomPosition]);
    gridValues.splice(newRandomPosition, 1);
  }

  return gridValues;
}

let wordGrid = setBackgrounds (uncoloredGrid, 5)

for(let i = 0; i < wordGrid.length; i++) {
  let newWord = faker.random.word();
  wordGrid[i] = Object.assign(wordGrid[i], { word: newWord });
}

wordGrid = wordGrid.sort((a,b) => a.index - b.index);

export default wordGrid
