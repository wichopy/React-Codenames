import React, { createElement as ce } from 'react';
import logo from './logo.svg';
import './App.css';
import faker from 'faker';

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

const wordCell = (id, value, type, selectHandler) => {
  return ce('td', {
    className: 'word-cell ' + type,
    name: id,
    onClick: () => selectHandler(id, value),
  }, value);
};

const RandomNumber = (min, max) => {
  let randomNumber = Math.floor(Math.random() * max) + min;
  return randomNumber;
}

const initialState = () => {
  // default 5 x 5 grid
  const unindexedGridValues = Array(25).fill({ word: '', type: '' });
  const gridValues = unindexedGridValues.map((cell, index) => { return { ...cell, index } });
  return {
    size: 5,
    gridValues,
  }
};

const setBackgrounds = (colorlessGrid, size) => {
  const gridValues = colorlessGrid.concat();
  let populateCount = 0;
  //set red team 
  for(let i = 0; i <= 8; i++){
    let newRandomPosition = RandomNumber(0, size * size - 1 - populateCount);
    gridValues[newRandomPosition].type = 'Red'
    populateCount++;
    gridValues.push(gridValues[newRandomPosition]);
    gridValues.remove(newRandomPosition);
    console.log('red')
  }
  //set blue team
  for(let i = 0; i <= 7; i++){
    let newRandomPosition = RandomNumber(0, size * size - 1 - populateCount);
    gridValues[newRandomPosition].type = 'Blue'
    populateCount++;
    gridValues.push(gridValues[newRandomPosition]);
    gridValues.remove(newRandomPosition);
    console.log('blue')
  }
  // set assassin
  gridValues[0].type = 'Assassin';
  populateCount++;
  gridValues.push(gridValues[0]);
  gridValues.remove(0);
  console.log('assassin')
  // set innocent peoples
  for(let i = 0; i <= 6; i++){
    let newRandomPosition = RandomNumber(0, size * size - 1 - populateCount);
    gridValues[newRandomPosition].type = 'Innocent'
    populateCount++;
    gridValues.push(gridValues[newRandomPosition]);
    gridValues.remove(newRandomPosition);
    console.log('innocent')
  }
  console.log('Done adding colors');
  console.log('------');
  console.log(gridValues);
  return gridValues;
}

class App extends React.Component {
  state = initialState();

  componentWillMount() {
    const gridValues = [...this.state.gridValues];
    console.log(gridValues);
    for(let i = 0; i < gridValues.length; i++) {
      let newWord = faker.random.word();
      gridValues[i] = {...gridValues[i], word: newWord};
    }
    this.setState({ gridValues });
  }

  componentDidMount() {
    console.log('App mounted.')
    const addBackgrounds = setBackgrounds(this.state.gridValues, this.state.size);
    const gridValues = addBackgrounds.sort((a,b) => a.index - b.index);
    this.setState({ gridValues });
  }

  gridRows = (size) => {
    const numberOfRows = Array(size).fill('');
    return (
      ce('tbody', {},
        numberOfRows.map((row,i) => {
          console.log('on row ', i)
          return (
            ce('tr', {},
              this.state.gridValues.slice(i*size, i*size+size).map((cell, index) => {
                console.log('on cell', i*size+index);
                return wordCell(i*size+index, cell.word, cell.type, this.selectWord)
              })
            )
          )
        })
      )
    );
  }

  selectWord = (position, value) => {
    console.log('Selecting Word: ', position, value);
    this.setState({ [position]: value });
  }

  render() {
    return (
      ce('div', { className: 'App' },
        ce('div', { className: 'container-fluid' },
          ce('div', { className: 'row'},
            ce('div', { className: 'col-4' }),
            ce('div', { className: 'col-2' },
              'Red Team'
            ),
            ce('div', { className: 'col-2' },
              'Blue Team'
            ),
            ce('div', { className: 'col-4' }),
            ce('div', { className: 'col-12' },
              ce('table', { className: 'word-cell-wrapper' },
                  this.gridRows(this.state.size),
              ),
            ),
          ),
        ),
      )
    );
  }
}

export default App;
