import * as Sentry from '@sentry/browser';
import nullthrows from 'nullthrows';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import App from './App';
import { store, persistor, initApp } from 'store';
import { PersistGate } from 'redux-persist/integration/react';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN });
}

initApp();

const renderApp = () =>
  // eslint-disable-next-line react/no-render-return-value
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>,
    nullthrows(document.getElementById('root'))
  );

//@ts-ignore
if (process.env.NODE_ENV !== 'production' && module.hot) {
  //@ts-ignore
  module.hot.accept('./App', renderApp);
}

renderApp();
