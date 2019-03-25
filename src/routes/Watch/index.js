// @flow

import * as React from 'react';
import * as hooks from 'hooks';
import YouTubePlayer, { type Video } from 'components/YouTubePlayer';

const Watch = ({ videoId, segmentIndex }: { videoId: string, segmentIndex: number }) => {
  const [video, setVideo] = React.useState((null: ?Video));
  const [seconds, setSeconds] = React.useState(0);
  const [data] = hooks.useVideoData(video);

  const segment = data && data.segments[segmentIndex];

  if (data && segment) {
    const start = segmentIndex === 0 ? 0 : data.segments[segmentIndex - 1].end;
    if (seconds !== start) {
      setSeconds(start);
    }
  }

  return (
    <div>
      <h1 style={{ color: 'white' }}>{segment && segment.title}</h1>
      <YouTubePlayer onReady={setVideo} {...{ videoId, seconds }} />
    </div>
  );
};

export default Watch;
