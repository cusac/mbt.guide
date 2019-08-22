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

  const updateSegmentAt = (index, data: $Shape<db.VideoSegment>) => {
    const newSegments = segments.slice();
    Object.assign(newSegments[index], data);
    setSegments(newSegments);
  };

  const addSegment = () => {
    const newSegments = segments.slice();
    const newId = uuid();
    newSegments.push({
      id: newId,
      videoId: video.data.id,
      start: 300,
      end: duration - 300,
      title: 'New segment title',
    });
    setSegments(newSegments);
    utils.history.push(`/edit/${video.data.id}/${newId}`);
  };

  const removeSegment = () => {
    const newSegments = segments.filter(s => s !== segment);
    setSegments(newSegments);
    utils.history.push(`/edit/${video.data.id}/${segments[0].id}`);
  };

  const saveChanges = async () => {
    try {
      await video.updateSegments(segments);
      alert('Changes saved!');
    } catch (e) {
      alert(String(e));
    }
  };

  const segment = segments.find(s => s.id === segmentId);
  if (!segment) {
    utils.history.push(`/edit/${video.data.id}/${segments[0].id}`);
    return <div />;
  }
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
                {segments.map((data, i) => (
                  <VideoSegment
                    key={data.id}
                    active={data.id === segmentId}
                    data={data}
                    color={segmentColors[i % segmentColors.length]}
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
                    segments[segments.length - 1].end + 2 * minSegmentDuration <= duration
                  )
                }
                onClick={addSegment}
              >
                <Icon name="add" /> Add
              </Button>
              <Button disabled={segments.length <= 1} color="red" onClick={removeSegment}>
                <Icon name="trash alternate outline" /> Remove
              </Button>
              <Button color="green" onClick={saveChanges}>
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
                onHandleSet={(i, value) =>
                  updateSegmentAt(index, i ? { end: value } : { start: value })
                }
                start={[segment.start, segment.end]}
                colors={[segmentColors[index % segmentColors.length]]}
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
