import React from 'react';
import { Grid, Label, Container, List } from '../components';

const SegmentItem = ({
  segment,
  handleSegmentSelect,
}: {
  segment: any;
  handleSegmentSelect: (segment: any) => any;
}): any => {
  return (
    <div onClick={() => handleSegmentSelect(segment)} className=" video-item item">
      <img
        className="ui image"
        src={segment.video.youtube.snippet.thumbnails.medium.url}
        alt={segment.description}
      />
      <div className="content">
        <div className="header ">{segment.title}</div>
      </div>
    </div>
  );
};
export default SegmentItem;
