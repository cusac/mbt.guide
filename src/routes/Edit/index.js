// @flow

import * as React from 'react';
import * as hooks from 'hooks';
import YouTubePlayer from 'components/YouTubePlayer';
import VideoSplitter from './VideoSplitter';

const segmentColors = ['orange', 'green', 'yellow', 'blue', 'red', 'purple'];
const minSegmentDuration = 5;

const Edit = ({ videoId }: { videoId: string }) => {
  const [video, update] = hooks.useVideoData({ ytVideoId: videoId, fallback: true });
  const [seconds, setSeconds] = React.useState(0);

  if (!video) {
    return <div>Loading video</div>;
  }

  return (
    <div>
      <YouTubePlayer autoplay={false} controls={false} {...{ videoId, seconds }} />
      <VideoSplitter
        onSave={update}
        {...{ video, setSeconds, segmentColors, minSegmentDuration }}
      />
    </div>
  );
};

export default Edit;
