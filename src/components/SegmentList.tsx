import React from 'react';
import SegmentItem from './SegmentItem';

const SegmentList = ({
  segments,
  handleSegmentSelect,
}: {
  segments: [];
  handleSegmentSelect: (segment: any) => any;
}) => {
  const renderedSegments = segments.map((segment: any) => {
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
