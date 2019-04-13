// @flow

import { Link } from 'react-router-dom';
import * as data from 'data';
import * as db from 'services/db';
import * as React from 'react';

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

  return (
    <div>
      <h3 style={{ color: 'white' }}>My Big TOE guide</h3>
      <br />
      {segments.map(segment => (
        <div key={segment.id} style={{ marginBottom: 5 }}>
          <Link
            to={`/watch/${segment.title.replace(/ /g, '-')}/${segment.videoId}/${segment.index}`}
          >
            {segment.title}
          </Link>
        </div>
      ))}
      <hr />
      <Link to={`/edit/k0aLELfo9ws`}>Edit sample video</Link>
    </div>
  );
};

export default Home;
