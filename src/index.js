// @flow

import * as React from 'react';
import ReactDOM from 'react-dom';
import nullthrows from 'nullthrows';

import 'semantic-ui-css/semantic.min.css';
import App from './App';

ReactDOM.render(<App />, nullthrows(document.getElementById('root')));
