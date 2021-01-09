import React from 'react';
import { YTVideo } from 'types';

const VideoItem = ({
  video,
  handleVideoSelect,
}: {
  video: YTVideo;
  handleVideoSelect: (video: YTVideo) => any;
}): any => {
  return (
    <div onClick={() => handleVideoSelect(video)} className=" video-item item">
      <img
        className="ui image"
        src={video.snippet.thumbnails.medium.url}
        alt={video.snippet.description}
      />
      <div className="content">
        <div className="header ">{video.snippet.title}</div>
      </div>
    </div>
  );
};
export default VideoItem;
