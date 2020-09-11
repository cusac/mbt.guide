import React from 'react';
import VideoItem from './VideoItem';

const VideoList = ({
  videos,
  videoSegmentMap,
  filterProcessedVideos,
  handleVideoSelect,
}: {
  videos: [],
  videoSegmentMap: {},
  filterProcessedVideos: boolean,
  handleVideoSelect: () => any,
}) => {
  const videosToShow = filterProcessedVideos
    ? videos.filter(v => !videoSegmentMap[v.id.videoId])
    : videos;
  const renderedVideos = videosToShow.map(video => {
    return <VideoItem key={video.id.videoId} video={video} handleVideoSelect={handleVideoSelect} />;
  });

  return <div className="ui relaxed divided list">{renderedVideos}</div>;
};
export default VideoList;
