// @flow

import * as components from 'components';
import * as hooks from 'hooks';
import * as React from 'react';

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
      <components.YouTubePlayerWithControls
        {...{ videoId, start, end }}
        autoplay
        duration={video.data.duration}
        end={segment.end}
        start={segment.start}
      />
    </div>
  );
};

export default Watch;
