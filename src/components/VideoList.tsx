import React from 'react';
import VideoItem from './VideoItem';

const VideoList = ({
  videos,
  videoSegmentMap,
  filterProcessedVideos,
  handleVideoSelect,
}: {
  videos: [];
  videoSegmentMap: {};
  filterProcessedVideos: boolean;
  handleVideoSelect: (video: any) => any;
}) => {
  const videosToShow = filterProcessedVideos
    ? videos.filter((v: any) => !(videoSegmentMap as any)[v.id.videoId])
    : videos;
  const renderedVideos = videosToShow.map((video: any) => {
    return <VideoItem key={video.id.videoId} video={video} handleVideoSelect={handleVideoSelect} />;
  });

  return <div className="ui relaxed divided list">{renderedVideos}</div>;
};
export default VideoList;
