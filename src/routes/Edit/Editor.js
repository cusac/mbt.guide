// @flow

import * as hooks from 'hooks';
import * as React from 'react';
import * as components from 'components';

import VideoSplitter from './VideoSplitter';

const { AppHeader, Container, Header, Icon, Loading } = components;

const segmentColors = ['orange', 'green', 'yellow', 'blue', 'red', 'purple'];
const minSegmentDuration = 5;

const Editor = ({ videoId, segmentId }: { videoId: string, segmentId: string }) => {
  const video = hooks.useVideo(videoId);

  if (!video) {
    return (
      <div>
        <AppHeader />
        <Loading>Loading video data...</Loading>
      </div>
    );
  }

  return <VideoSplitter {...{ segmentId, video, videoId, segmentColors, minSegmentDuration }} />;
};

export default Editor;
