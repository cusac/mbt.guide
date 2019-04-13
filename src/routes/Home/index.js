// @flow

import * as components from 'components';
import * as data from 'data';
import * as db from 'services/db';
import * as React from 'react';
import * as services from 'services';

import Auth from './Auth';

import logo from './logo-wide.png';

const { Button, Link } = components;

const Home = () => {
  const [error, setError] = React.useState();
  const [segments, setSegments] = React.useState((undefined: Array<db.VideoSegment> | void));
  React.useEffect(() => {
    data.Video.getSegments().then(setSegments, setError);
  }, []);
  if (error) {
    throw error;
  }

  if (!segments) {
    return <div>Loading segments</div>;
  }

  const user = services.auth.currentUser;

  return (
    <div>
      <img src={logo} alt="My Big TOE guide" style={{ width: '30%' }} />
      {/* <h3 style={{ color: 'white' }}>My Big TOE guide</h3> */}
      {segments.map(segment => (
        <div key={segment.id} style={{ marginBottom: 5 }}>
          <Link to={`/watch/${segment.title.replace(/ /g, '-')}/${segment.id}`}>
            {segment.title}
          </Link>
        </div>
      ))}
      <hr />
      {user ? (
        <div>
          Welcome {user.email}!<br />
          <Button onClick={() => services.auth.signOut()} style={{ margin: 5 }}>
            Sign out
          </Button>
          <br />
          <Link to={`/edit/k0aLELfo9ws`}>Edit sample video</Link>
        </div>
      ) : (
        <Auth />
      )}
    </div>
  );
};

export default Home;
