import React, { createElement as ce } from 'react';
import ToastrContainer from 'react-toastr-basic'
import './App.css';

import keydown from 'react-keydown';
import { inject } from 'mobx-react'

import Scoreboard from './Models/Scoreboard';
import TurnsManager from './Models/turnsManager';
import WordCellGrid from './Components/WordGrid/WordCellGrid';
import CluesFeed from './Components/Clues/CluesFeed'
import SkipTurnButton from './Components/SkipButtonWithConfirmation'
import CreateSpymaster from './Components/Auth/Create'
import LoginAsSpymaster from './Components/Auth/Login'
import NewGameWrapper from './Components/NewGameWrapper'
import CheckboxWordReshuffle from './Components/CheckboxWordReshuffle'
import ViewingAs from './Components/ViewingAs'
import NewGame from './Components/NewGame'

@inject('authStore', 'modifierStore', 'sessionStore')
@keydown
class App extends React.Component {

  constructor(props) {
		super(props);
    this.authStore = this.props.authStore;
    this.modifierStore = this.props.modifierStore;
    this.sessionStore = this.props.sessionStore;
  }

  componentWillReceiveProps( nextProps ) {
    const { keydown: { event } } = nextProps
    // Listen for keystrokes.
    if (this.authStore.token && event && event.code === "KeyE") {
      this.modifierStore.handleEnableReshuffle()
    }
  }

  componentDidMount() {
    console.log('App mounted.')
  }

  render() {
    return (
        ce('div', { className: 'App' },
          ce('div', { className: 'container' },

            ce(ToastrContainer, {}),
            ce('div', { className: 'row'}, 
              ce(ViewingAs, {}),
              ce('h2', {}, ' --- '),
              ce('h2', {}, 'game ID: ' + this.sessionStore.gameId),
              ce(NewGame, {})
            ),
            ce('div', { className: 'row'},
              ce('div', { className: 'col-lg-6 col-xs-8' },
                ce(Scoreboard, {})
              ),
              ce('div', { className: 'col-lg-6 col-xs-4' },
                ce(TurnsManager, {}),
              )
            ),

            ce('div', { className: 'row'},
              ce('div', { className: 'col-lg-8 col-xs-12' },
                ce(WordCellGrid, {}),
                ce(SkipTurnButton, {}),
                ce(NewGameWrapper, {}),
              ),
              ce('div', { className: 'col-lg-4 col-xs-12' },
                ce(CreateSpymaster, {}),
                ce(LoginAsSpymaster, {}),
                ce(CheckboxWordReshuffle, {}),
                ce(CluesFeed, {})
              ),
            ),
          ),
      )
    );
  }
}

export default App;
