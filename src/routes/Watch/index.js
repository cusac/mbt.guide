// @flow

import * as React from 'react';
import * as hooks from 'hooks';
import YouTubePlayer from 'components/YouTubePlayer';

const Watch = ({ videoId, segmentIndex }: { videoId: string, segmentIndex: number }) => {
  const video = hooks.useVideo(videoId);
  if (!video) {
    return <div>Loading video data</div>;
  }

  const segment = video.segments[segmentIndex];
  if (!segment) {
    return <div>Missing segment</div>;
  }

  const { start, end } = segment;
  return (
    <div>
      <h1 style={{ color: 'white' }}>{segment.title}</h1>
      <YouTubePlayer {...{ videoId, start, end }} />
    </div>
  );
};

export default Watch;
