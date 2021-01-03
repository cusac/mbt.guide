import * as Sentry from '@sentry/browser';
import nullthrows from 'nullthrows';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import React from 'reactn';
import 'semantic-ui-css/semantic.min.css';
import App from './App';
import * as store from './store';
import { store_new } from './store_new/index';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN });
}

store.initState();

const renderApp = () =>
  // eslint-disable-next-line react/no-render-return-value
  ReactDOM.render(
    <Provider store={store_new}>
      <App />
    </Provider>,
    nullthrows(document.getElementById('root'))
  );

//@ts-ignore
if (process.env.NODE_ENV !== 'production' && module.hot) {
  //@ts-ignore
  module.hot.accept('./App', renderApp);
}

renderApp();
