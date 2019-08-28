// @flow

import * as hooks from 'hooks';
import * as React from 'react';

import VideoSplitter from './VideoSplitter';

const segmentColors = ['orange', 'green', 'yellow', 'blue', 'red', 'purple'];
const minSegmentDuration = 5;

const Editor = ({ videoId, segmentId }: { videoId: string, segmentId: string }) => {
  const video = hooks.useVideo(videoId);

  if (!video) {
    return <div>Loading video data</div>;
  }

  return <VideoSplitter {...{ segmentId, video, videoId, segmentColors, minSegmentDuration }} />;
};

export default Editor;
