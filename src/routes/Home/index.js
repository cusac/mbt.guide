// @flow

import * as React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div>
    <h3 style={{ color: 'white' }}>Welcome to MBT Guide</h3>
    <br />
    <Link to={`/watch/Sample-video/k0aLELfo9ws/1`}>Watch sample video</Link>
    <br />
    <br />
    <Link to={`/edit/k0aLELfo9ws`}>Edit sample video</Link>
  </div>
);

export default Home;
