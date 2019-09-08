// @flow

import React from 'reactn';
import ReactDOM from 'react-dom';
import nullthrows from 'nullthrows';

import 'semantic-ui-css/semantic.min.css';
import App from './App';
import * as store from 'store';

store.initState();

ReactDOM.render(<App />, nullthrows(document.getElementById('root')));
