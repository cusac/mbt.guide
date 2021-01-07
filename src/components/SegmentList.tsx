import React from 'react';
import SegmentItem from './SegmentItem';
import { Segment } from 'types';

const SegmentList = ({
  segments,
  handleSegmentSelect,
}: {
  segments: Segment[];
  handleSegmentSelect: (segment: Segment) => any;
}) => {
  const renderedSegments = segments.map(segment => {
    return (
      <SegmentItem
        key={segment.segmentId}
        segment={segment}
        handleSegmentSelect={handleSegmentSelect}
      />
    );
  });

  return <div className="ui relaxed divided list">{renderedSegments}</div>;
};
export default SegmentList;
