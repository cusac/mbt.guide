// @flow

import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import * as routes from 'routes';
import * as components from 'components';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <components.ErrorBoundary>
          <Router>
            <Route path="/" exact component={routes.Home} />
            <Route
              path="/edit/:videoId"
              render={props => <routes.Edit {...props} videoId={props.match.params.videoId} />}
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
