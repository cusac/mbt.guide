import React from 'react';
import { Segment, Video } from 'types';
import { verifyModelType } from '../types';

const SegmentItem = ({
  segment,
  handleSegmentSelect,
}: {
  segment: Segment;
  handleSegmentSelect: (segment: Segment) => any;
}): any => {
  const { video } = segment;
  let src: string;
  if (verifyModelType<Video>(video, 'Video')) {
    src = video.youtube.snippet.thumbnails.medium.url;
  } else {
    src = '';
  }
  return (
    <div onClick={() => handleSegmentSelect(segment)} className=" video-item item">
      <img className="ui image" src={src} alt={segment.description} />
      <div className="content">
        <div className="header ">{segment.title}</div>
      </div>
    </div>
  );
};
export default SegmentItem;
