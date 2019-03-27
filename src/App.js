// @flow

import { Router, Route } from 'react-router-dom';
import * as components from 'components';
import * as React from 'react';
import * as routes from 'routes';
import * as utils from 'utils';

import './App.css';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <components.ErrorBoundary onError={() => <div>Something went wrong!</div>}>
          <Router history={utils.history}>
            <Route path="/" exact component={routes.Home} />
            <Route
              path="/edit/:videoId/:index?"
              render={props => {
                const { videoId } = props.match.params;
                const index = Number(props.match.params.index || 0);
                return <routes.Edit {...props} {...{ videoId, index }} />;
              }}
            />
            <Route
              path="/watch/:title/:videoId/:segmentIndex"
              render={props => {
                // TODO encode segmentIndex as last character of videoId
                const { videoId } = props.match.params;
                const segmentIndex = Number(props.match.params.segmentIndex);
                return <routes.Watch {...props} {...{ videoId, segmentIndex }} />;
              }}
            />
          </Router>
        </components.ErrorBoundary>
      </header>
    </div>
  );
};

export default App;
