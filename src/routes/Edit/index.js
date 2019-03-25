// @flow

import * as React from 'react';
import * as hooks from 'hooks';
import YouTubePlayer, { type Video } from 'components/YouTubePlayer';
import VideoSplitter from './VideoSplitter';

const segmentColors = ['orange', 'green', 'yellow', 'blue', 'red', 'purple'];
const minSegmentDuration = 5;

const Edit = ({ videoId }: { videoId: string }) => {
  const [video, setVideo] = React.useState((null: ?Video));
  const [seconds, setSeconds] = React.useState(0);
  const [data, update] = hooks.useVideoData(video);

  return (
    <div>
      <YouTubePlayer
        autoplay={false}
        controls={false}
        onReady={setVideo}
        {...{ videoId, seconds }}
      />
      {video && data ? (
        <VideoSplitter
          onSave={update}
          {...{ video, data, setSeconds, segmentColors, minSegmentDuration }}
        />
      ) : (
        <p>Loading video...</p>
      )}
    </div>
  );
};

export default Edit;
