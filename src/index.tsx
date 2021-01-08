import * as Sentry from '@sentry/browser';
import nullthrows from 'nullthrows';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import React from 'reactn';
import 'semantic-ui-css/semantic.min.css';
import App from './App';
import * as store from './store';
import { store_new, persistor } from './store_new';
import { PersistGate } from 'redux-persist/integration/react';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN });
}

store.initState();

const renderApp = () =>
  // eslint-disable-next-line react/no-render-return-value
  ReactDOM.render(
    <Provider store={store_new}>
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
