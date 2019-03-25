// @flow

import * as React from 'react';
import * as hooks from 'hooks';
import YouTubePlayer from 'components/YouTubePlayer';

const Watch = ({ videoId, segmentIndex }: { videoId: string, segmentIndex: number }) => {
  const [data] = hooks.useVideoData({ ytVideoId: videoId });
  if (!data) {
    return <div>Loading video data</div>;
  }

  const segment = data.segments[segmentIndex];
  if (!segment) {
    return <div>Missing segment</div>;
  }
  const start = segmentIndex === 0 ? 0 : data.segments[segmentIndex - 1].end;
  return (
    <div>
      <h1 style={{ color: 'white' }}>{segment.title}</h1>
      <YouTubePlayer {...{ videoId, start, end: segment.end }} />
    </div>
  );
};

export default Watch;
