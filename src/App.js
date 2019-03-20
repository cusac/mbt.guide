// @flow

import * as React from 'react';

import './App.css';
import YouTubePlayer, { type Video } from './YouTubePlayer';
import VideoSplitter from './VideoSplitter';

const segmentColors = ['orange', 'green', 'yellow', 'blue', 'red', 'purple'];
const minSegmentDuration = 5;

const App = () => {
  const [video, setVideo] = React.useState((null: ?Video));
  const [seconds, setSeconds] = React.useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <YouTubePlayer onReady={data => setVideo(data)} seconds={seconds} />
        {video ? (
          <VideoSplitter {...{ video, setSeconds, segmentColors, minSegmentDuration }} />
        ) : (
          <p>Loading video...</p>
        )}
      </header>
    </div>
  );
};

export default App;
