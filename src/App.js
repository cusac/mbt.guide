// @flow

import * as React from 'react';
import { Button } from 'semantic-ui-react';

import './App.css';
import YouTubePlayer, { type Video } from './YouTubePlayer';
import Slider from './Slider';

const App = () => {
  const [video, setVideo] = React.useState((null: ?Video));
  const [seconds, setSeconds] = React.useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <YouTubePlayer onReady={data => setVideo(data)} seconds={seconds} />
        {video ? (
          <div>
            <Slider
              range={{ min: 0, max: video.duration }}
              onHandleUpdate={(index, value) => setSeconds(value)}
            />
          </div>
        ) : (
          <p>Loading video...</p>
        )}
        <br />
        <br />
        <Button as="a" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </Button>
      </header>
    </div>
  );
};

export default App;
