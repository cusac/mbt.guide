// @flow

import * as React from 'react';
import { Button, Segment, Icon } from 'semantic-ui-react';
import invariant from 'invariant';

import type { Video } from 'components/YouTubePlayer';
import Slider from './Slider';
import VideoSegment from './VideoSegment';

export type SegmentData = {|
  end: number, // seconds
  title: string,
|};

const VideoSplitter = ({
  video,
  setSeconds,
  segmentColors,
  minSegmentDuration,
}: {
  video: Video,
  setSeconds: number => void,
  segmentColors: Array<string>,
  minSegmentDuration: number,
}) => {
  const [segments, setSegments] = React.useState(
    ([
      {
        end: video.duration, // last segment's end is the video duration
        title: 'First segment',
      },
    ]: Array<SegmentData>)
  );

  invariant(segments.length > 0, 'at least one segment required');

  const updateSegmentAt = (index, data) => {
    const newSegments = segments.slice();
    newSegments[index] = {
      ...newSegments[index],
      ...data,
    };
    setSegments(newSegments);
  };
  return (
    <div>
      <Slider
        key={segments.length} // causes slider recreation on segments count change
        range={{ min: 0, max: video.duration }}
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
        {segments.map((data, index) => (
          <VideoSegment
            key={index}
            index={index}
            data={data}
            color={segmentColors[index]}
            start={index ? segments[index - 1].end : 0}
            onChange={newData => updateSegmentAt(index, newData)}
          />
        ))}
      </Segment.Group>
      <br />
      <div>
        <Button
          disabled={
            !(
              segments.length === 1 ||
              segments[segments.length - 2].end + 2 * minSegmentDuration <= video.duration
            )
          }
          onClick={() => {
            const newSegments = segments.slice();
            const prevEnd = newSegments.length === 1 ? 0 : newSegments[newSegments.length - 2].end;
            newSegments[newSegments.length - 1] = {
              ...newSegments[newSegments.length - 1],
              end: Math.round((prevEnd + video.duration) / 2),
            };
            newSegments.push({
              end: video.duration,
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
            newSegments[newSegments.length - 1] = {
              ...newSegments[newSegments.length - 1],
              end: video.duration,
            };
            setSegments(newSegments);
          }}
        >
          <Icon name="trash alternate outline" /> Remove last segment
        </Button>
        <Button color="green">
          <Icon name="save" /> Save changes
        </Button>
      </div>
    </div>
  );
};

export default VideoSplitter;
