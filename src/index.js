// @flow

import * as React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import 'semantic-ui-css/semantic.min.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('No root element');
}

ReactDOM.render(<App />, root);
