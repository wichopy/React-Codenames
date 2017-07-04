import React, { createElement as ce } from 'react';
import logo from './logo.svg';
import './App.css';
import faker from 'faker';

const wordCell = (id, value, selectHandler) => {
  return ce('td', {
    className: 'word-cell',
    name: id,
    onClick: () => selectHandler(id, value),
  }, value);
};

// const RandomNumber = (min, max) => {
//   //from https://stackoverflow.com/questions/34182699/random-integer-in-a-certain-range-excluding-one-number
//   const exclusionsSorted = exclusions.concat().sort(function(a, b) {
//     return a - b
//   });
//   let randomNumber = Math.floor(Math.random() * max) + min;
//   for(let i = 0; i < max; i++) {
//     if (exclusionsSorted.findrandomNumber >= exclusionsSorted[i]) {
//       randomNumber++;
//     }
//   }
//   return randomNumber;
// }

const initialState = {
  size: 5, //default 5 x 5 grid
  gridValues: Array(25).fill({ word: '', type: '' }),
};

// const setBackgrounds = () => {
//   const gridValues = this.state.gridValues.concat();
//   const sessionGameBoard = {};
//   const populateCount = 0;
//   //set red team 
//   for(let i = 0; i < 9; i++){
//     let newRandomPosition = RandomNumber(0, size * size - 1, exclusionList)
//     exclusionList.push(newRandomPosition);
//     sessionGameBoard[newRandomPosition] = { owner: 'Red' };
//   }
//   //set blue team
//   for(let i = 0; i < 9; i++){
//     let newRandomPosition = RandomNumber(0, size * size - 1, exclusionList)
//     exclusionList.push(newRandomPosition);
//     sessionGameBoard[newRandomPosition] = { owner: 'Red' };
//   }
// }

class App extends React.Component {
  state = initialState;

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
                return wordCell(i*size+index, cell.word, this.selectWord)
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
        ce('div', { className: 'App-header' },
          ce('img', { src: logo , className: 'App-logo', alt: 'logo' },
          ),
          ce('h2', {}, 'React Codenames'),
        ),
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
