// @flow

import React from 'reactn';
import ReactDOM from 'react-dom';
import nullthrows from 'nullthrows';

import 'semantic-ui-css/semantic.min.css';
import App from './App';
import * as store from 'store';
import * as Sentry from '@sentry/browser';

Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN });

store.initState();

ReactDOM.render(<App />, nullthrows(document.getElementById('root')));
