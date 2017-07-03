import React, { createElement as ce } from 'react';
import logo from './logo.svg';
import './App.css';
import faker from 'faker';

const wordCell = (id, value, selectHandler) => {
  return ce('td', { className: 'word-cell', name: id, onClick: () => selectHandler(id, value) }, value);
};

const RandomNumber = (min, max, exclusions) => {
  //from https://stackoverflow.com/questions/34182699/random-integer-in-a-certain-range-excluding-one-number
  const exclusionsSorted = exclusions.concat().sort(function(a, b) {
    return a - b
  });
  let randomNumber = Math.floor(Math.random() * max) + min;
  for(let i = 0; i < exclusionsSorted.length; i++) {
    if (randomNumber >= exclusionsSorted[i]) {
      randomNumber++;
    }
  }
  return randomNumber;
}

const positionToNumber = {
  A1: '', A2: '', A3: '', A4: '', A5: '',
  B1: '', B2: '', B3: '', B4: '', B5: '',
  C1: '', C2: '', C3: '', C4: '', C5: '',
  D1: '', D2: '', D3: '', D4: '', D5: '',
  E1: '', E2: '', E3: '', E4: '', E5: '',
}

const initialState = {
  size: 5, //default 5 x 5 grid
  gridValues: Array(25).fill(''),
};

// const setBackgrounds = () => {
//   const newState = initialState;
  
//   for (let position in initialState) {
//   }
// const exclusionList = [];
// for(let i = 0; i < size * size - 1; i++) {
//   let newRandomPosition = RandomNumber(0, size * size - 1, exclusionList)
//   exclusionList.push(newRandomPosition);

// }
// }

class App extends React.Component {
  state = initialState;

  componentWillMount() {
    this.setState({ gridValues: this.state.gridValues.map(cell => faker.random.word()) });
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
                return wordCell(i+index, cell, this.selectWord)
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
            ce('div', { className: 'col' },
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
