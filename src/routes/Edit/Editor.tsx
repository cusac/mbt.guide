import React from 'react';
import VideoSplitter from './VideoSplitter';

const segmentColors = ['orange', 'green', 'yellow', 'blue', 'red', 'purple'];
const minSegmentDuration = 5;

const Editor = ({ videoId, segmentId }: { videoId: string; segmentId: string }) => {
  return <VideoSplitter {...{ segmentId, videoId, segmentColors, minSegmentDuration }} />;
};

export default Editor;
