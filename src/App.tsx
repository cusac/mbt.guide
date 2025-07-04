import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import * as components from './components';
import React from 'react';
import * as routes from './routes';
import * as services from './services';

// Import css
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Layout from 'components/Layout';

const App = () => {
  const [, setUser] = React.useState(undefined);
  React.useEffect(() => {
    services.firebaseAuth.onAuthStateChanged(setUser as any);
  }, []);

  try {
    (services as any).stats.postVisit();
  } catch (err) {}

  return (
    <div className="App">
      <components.ErrorBoundary onError={() => <div>Something went wrong</div>}>
        <Layout>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<routes.Home />} />
              <Route path="/videos" element={<routes.Videos />} />
              <Route path="/my-segments" element={<routes.MySegments />} />
              <Route path="/segments/:segmentId" element={<routes.Segments />} />
              <Route path="/edit/:videoId/:segmentId?" element={<EditRouteWrapper />} />
              <Route path="/contact" element={<routes.Contact />} />
            </Routes>
          </BrowserRouter>
        </Layout>
      </components.ErrorBoundary>
    </div>
  );
};

const EditRouteWrapper = () => {
  const { videoId, segmentId } = useParams();
  return <routes.Edit videoId={videoId!} segmentId={segmentId} />;
};

export default App;
