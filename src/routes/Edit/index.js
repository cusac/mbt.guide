// @flow

import * as React from 'react';

import YouTubePlayer, { type Video } from 'components/YouTubePlayer';
import VideoSplitter from './VideoSplitter';

const segmentColors = ['orange', 'green', 'yellow', 'blue', 'red', 'purple'];
const minSegmentDuration = 5;

const Edit = ({ videoId }: { videoId: string }) => {
  const [video, setVideo] = React.useState((null: ?Video));
  const [seconds, setSeconds] = React.useState(0);

  return (
    <div>
      <YouTubePlayer onReady={data => setVideo(data)} {...{ videoId, seconds }} />
      {video ? (
        <VideoSplitter {...{ video, setSeconds, segmentColors, minSegmentDuration }} />
      ) : (
        <p>Loading video...</p>
      )}
    </div>
  );
};

export default Edit;
