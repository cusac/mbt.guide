// @flow

import React from 'react';
import VideoItem from './VideoItem';

const VideoList = ({ videos, handleVideoSelect }: { videos: [], handleVideoSelect: () => any }) => {
  const renderedVideos = videos.map(video => {
    return <VideoItem key={video.id.videoId} video={video} handleVideoSelect={handleVideoSelect} />;
  });

  return <div className="ui relaxed divided list">{renderedVideos}</div>;
};
export default VideoList;
