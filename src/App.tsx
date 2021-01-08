import { Router, Route } from 'react-router-dom';
import * as components from './components';
import React from 'reactn';
import * as routes from './routes';
import * as services from './services';
import * as utils from './utils';
import { toast } from 'react-toastify';

// Import css
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { initApp } from 'store_new';

toast.configure();

const App = () => {
  const [, setUser] = React.useState(undefined);
  React.useEffect(() => {
    services.firebaseAuth.onAuthStateChanged(setUser as any);
  }, []);

  initApp();

  try {
    (services as any).stats.postVisit();
  } catch (err) {}

  return (
    <div className="App">
      <components.ErrorBoundary onError={() => <div>Something went wrong!</div>}>
        <Router history={utils.history}>
          <Route
            path="/:videoId?"
            exact
            render={props => {
              const { videoId } = props.match.params;
              return <routes.Home {...props} {...{ videoId }} />;
            }}
          />
          <Route
            path="/search/:segmentId"
            exact
            render={props => {
              const { segmentId } = props.match.params;
              return <routes.Search {...props} {...{ segmentId }} />;
            }}
          />
          <Route
            path="/edit/:videoId/:segmentId?"
            render={props => {
              const { videoId } = props.match.params;
              const { segmentId } = props.match.params;
              return <routes.Edit {...props} {...{ videoId, segmentId }} />;
            }}
          />
        </Router>
      </components.ErrorBoundary>
    </div>
  );
};

export default App;
