// @flow

import { Router, Route } from 'react-router-dom';
import * as components from 'components';
import * as data from 'data';
import * as React from 'react';
import * as routes from 'routes';
import * as services from 'services';
import * as utils from 'utils';

import './App.css';

const App = () => {
  const [, setUser] = React.useState(undefined);
  React.useEffect(() => {
    services.auth.onAuthStateChanged(setUser);
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <components.ErrorBoundary onError={() => <div>Something went wrong!</div>}>
          <Router history={utils.history}>
            <Route path="/" exact component={routes.Home} />
            <Route
              path="/edit/:videoId/:segmentId?"
              render={props => {
                const { videoId } = props.match.params;
                const { segmentId } = props.match.params;
                return <routes.Edit {...props} {...{ videoId, segmentId }} />;
              }}
            />
            <Route
              path="/watch/:videoId/:segmentId"
              render={props => {
                const { videoId } = props.match.params;
                const { segmentId } = props.match.params;
                return <routes.Watch {...props} {...{ videoId, segmentId }} />;
              }}
            />
          </Router>
        </components.ErrorBoundary>
      </header>
    </div>
  );
};

export default App;
