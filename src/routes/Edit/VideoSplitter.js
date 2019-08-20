// @flow

import * as components from 'components';
import * as data from 'data';
import * as db from 'services/db';
import * as React from 'react';
import * as utils from 'utils';
import invariant from 'invariant';
import { v4 as uuid } from 'uuid';

import VideoSegment from './VideoSegment';

const { Button, Grid, Icon, Input, Segment } = components;

const VideoSplitter = ({
  video,
  segmentId,
  segmentColors,
  minSegmentDuration,
}: {
  video: data.Video,
  segmentId: string,
  segmentColors: Array<string>,
  minSegmentDuration: number,
}) => {
  const [segments, setSegments] = React.useState(video.segments);
  invariant(segments.length > 0, 'at least one segment required');

  const updateSegmentAt = (i, data: $Shape<db.VideoSegment>) => {
    const newSegments = segments.slice();
    console.log('NEW SEGS:', newSegments);
    console.log('Data:', data);
    Object.assign(newSegments[i], data);
    if ('end' in data && i + 1 < newSegments.length) {
      Object.assign(newSegments[i + 1], { start: data.end });
    }
    setSegments(newSegments);
  };

  //TODO: Create segment if segmentId doesn't exist? (REF ORIG CODE)
  console.log('SEG ID:', segmentId);
  console.log('SEGMENTS:', segments);
  const segment = segments.find(s => s.id === segmentId);
  invariant(segment, 'segment not found');
  const index = segments.indexOf(segment);

  const { duration } = video.data;

  return (
    <div style={{ width: 1012 }}>
      <Grid>
        <Grid.Row style={{ height: 420 }}>
          <Grid.Column width={11} style={{ padding: 0 }}>
            <components.YouTubePlayerWithControls
              duration={video.data.duration}
              end={segments[index].end}
              start={segments[index].start}
              videoId={video.data.id}
            />
          </Grid.Column>
          <Grid.Column width={5} style={{ height: '100%', padding: 0 }}>
            <Segment attached style={{ height: '100%', overflowY: 'auto' }}>
              <Segment.Group>
                {segments.map(data => (
                  <VideoSegment
                    key={data.id}
                    active={data.id === segmentId}
                    data={data}
                    color={segmentColors[0]}
                    onSelect={() => utils.history.push(`/edit/${video.data.id}/${data.id}`)}
                  />
                ))}
              </Segment.Group>
            </Segment>
            <Button.Group attached="bottom">
              <Button
                disabled={
                  !(
                    segments.length === 1 ||
                    segments[segments.length - 2].end + 2 * minSegmentDuration <= duration
                  )
                }
                onClick={() => {
                  const newSegments = segments.slice();
                  const prevEnd =
                    newSegments.length === 1 ? 0 : newSegments[newSegments.length - 2].end;
                  const lastEnd = Math.round((prevEnd + duration) / 2);
                  Object.assign(newSegments[newSegments.length - 1], {
                    end: lastEnd,
                  });
                  newSegments.push({
                    id: uuid(),
                    videoId: video.data.id,
                    start: lastEnd,
                    end: duration,
                    title: 'New segment title',
                  });
                  setSegments(newSegments);
                }}
              >
                <Icon name="add" /> Add
              </Button>
              <Button
                color="red"
                onClick={() => {
                  const newSegments = segments.slice(0, -1);
                  Object.assign(newSegments[newSegments.length - 1], {
                    end: duration,
                  });
                  setSegments(newSegments);
                }}
              >
                <Icon name="trash alternate outline" /> Remove
              </Button>
              <Button
                color="green"
                onClick={async () => {
                  try {
                    await video.updateSegments(segments);
                    alert('OK!');
                  } catch (e) {
                    alert(String(e));
                  }
                }}
              >
                <Icon name="save" /> Save
              </Button>
            </Button.Group>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column style={{ padding: 0 }}>
            <div
              style={{
                height: 120,
                overflowX: 'auto',
                overflowY: 'hidden',
                paddingLeft: 50,
                paddingTop: 50,
              }}
            >
              <components.Slider
                key={segments.length} // causes slider recreation on segments count change
                range={{ min: 0, max: duration }}
                onHandleSet={(i, value) => updateSegmentAt(i, { end: value })}
                start={segments.slice(0, -1).map(({ end }) => end)}
                colors={segmentColors}
                margin={minSegmentDuration}
                width={900} // TODO make dependant on video duration
                pips
              />
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column style={{ color: 'white ' }} verticalAlign="middle" width={3}>
            Title
          </Grid.Column>
          <Grid.Column width={7}>
            <Input
              fluid
              placeholder="Title"
              value={segments[index].title}
              onChange={(event, { value }) => updateSegmentAt(index, { title: value })}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default VideoSplitter;
