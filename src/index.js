import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ToastrContainer } from 'react-toastr-basic'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
