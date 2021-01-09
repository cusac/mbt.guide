import React from 'react';
import VideoItem from './VideoItem';
import { YTVideo } from 'types';

const VideoList = ({
  videos,
  handleVideoSelect,
}: {
  videos: YTVideo[];
  handleVideoSelect: (video: YTVideo) => any;
}): any => {
  const renderedVideos = videos.map(video => {
    return <VideoItem key={video.id} video={video} handleVideoSelect={handleVideoSelect} />;
  });

  return <div className="ui relaxed divided list">{renderedVideos}</div>;
};
export default VideoList;
