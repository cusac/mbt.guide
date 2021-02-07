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
    <React.Fragment>
      <div onClick={() => handleVideoSelect(video)} className=" video-item item">
        <img
          className="ui image"
          src={video.snippet.thumbnails.default.url}
          alt={video.snippet.description}
        />
        <div className="vidtitle">{video.snippet.title}</div>
      </div>
    </React.Fragment>
  );
};
export default VideoItem;
