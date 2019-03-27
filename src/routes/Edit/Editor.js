// @flow

import * as hooks from 'hooks';
import * as React from 'react';

import VideoSplitter from './VideoSplitter';

const segmentColors = ['orange', 'green', 'yellow', 'blue', 'red', 'purple'];
const minSegmentDuration = 5;

const Editor = ({ videoId, index }: { videoId: string, index: number }) => {
  const video = hooks.useVideo(videoId);

  if (!video) {
    return <div>Loading video data</div>;
  }

  return (
    <VideoSplitter
      index={Math.min(index, video.segments.length - 1)}
      {...{ video, segmentColors, minSegmentDuration }}
    />
  );
};

export default Editor;
