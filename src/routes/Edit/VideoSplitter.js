// @flow

import * as React from 'react';
import { Button, Segment, Icon } from 'semantic-ui-react';
import invariant from 'invariant';
import * as data from 'data';

import Slider from './Slider';
import VideoSegment from './VideoSegment';

const VideoSplitter = ({
  video,
  setSeconds,
  segmentColors,
  minSegmentDuration,
}: {
  video: data.Video,
  setSeconds: number => void,
  segmentColors: Array<string>,
  minSegmentDuration: number,
}) => {
  const [segments, setSegments] = React.useState(video.segments);
  invariant(segments.length > 0, 'at least one segment required');

  const updateSegmentAt = (index, data) => {
    const newSegments = segments.slice();
    Object.assign(newSegments[index], data);
    if ('end' in data && index + 1 < newSegments.length) {
      Object.assign(newSegments[index + 1], { start: data.end });
    }
    setSegments(newSegments);
  };

  const { duration } = video.data;

  return (
    <div>
      <Slider
        key={segments.length} // causes slider recreation on segments count change
        range={{ min: 0, max: duration }}
        onHandleUpdate={(index, value) => setSeconds(value)}
        onHandleSet={(index, value) => updateSegmentAt(index, { end: value })}
        start={segments.slice(0, -1).map(({ end }) => end)}
        colors={segmentColors}
        margin={minSegmentDuration}
      />
      <br />
      <br />
      <br />
      <Segment.Group>
        {segments.map(data => (
          <VideoSegment
            key={data.index}
            data={data}
            color={segmentColors[data.index]}
            onChange={newData => updateSegmentAt(data.index, newData)}
          />
        ))}
      </Segment.Group>
      <br />
      <div>
        <Button
          disabled={
            !(
              segments.length === 1 ||
              segments[segments.length - 2].end + 2 * minSegmentDuration <= duration
            )
          }
          onClick={() => {
            const newSegments = segments.slice();
            const prevEnd = newSegments.length === 1 ? 0 : newSegments[newSegments.length - 2].end;
            const lastEnd = Math.round((prevEnd + duration) / 2);
            Object.assign(newSegments[newSegments.length - 1], {
              end: lastEnd,
            });
            newSegments.push({
              id: `${video.data.id}${newSegments.length}`,
              videoId: video.data.id,
              index: newSegments.length,
              start: lastEnd,
              end: duration,
              title: 'New segment title',
            });
            setSegments(newSegments);
          }}
        >
          <Icon name="add" /> Add new segment
        </Button>
        <Button
          color="red"
          disabled={segments.length === 1}
          onClick={() => {
            const newSegments = segments.slice(0, -1);
            Object.assign(newSegments[newSegments.length - 1], {
              end: duration,
            });
            setSegments(newSegments);
          }}
        >
          <Icon name="trash alternate outline" /> Remove last segment
        </Button>
        <Button color="green" onClick={() => video.updateSegments(segments)}>
          <Icon name="save" /> Save changes
        </Button>
      </div>
    </div>
  );
};

export default VideoSplitter;
