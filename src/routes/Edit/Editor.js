// @flow

import * as components from 'components';
import * as hooks from 'hooks';
import * as React from 'react';

import VideoSplitter from './VideoSplitter';

const segmentColors = ['orange', 'green', 'yellow', 'blue', 'red', 'purple'];
const minSegmentDuration = 5;

const Editor = ({ videoId }: { videoId: string }) => {
  const [seconds, setSeconds] = React.useState(0);
  const video = hooks.useVideo(videoId);

  if (!video) {
    return <div>Loading video</div>;
  }

  return (
    <div>
      <components.YouTubePlayer autoplay={false} controls={false} {...{ videoId, seconds }} />
      <VideoSplitter {...{ video, setSeconds, segmentColors, minSegmentDuration }} />
    </div>
  );
};

export default Editor;
