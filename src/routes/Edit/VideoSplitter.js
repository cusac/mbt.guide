// @flow

import * as components from 'components';
import * as data from 'data';
import * as db from 'services/db';
import * as React from 'react';
import * as utils from 'utils';
import invariant from 'invariant';

import VideoSegment from './VideoSegment';

const { Button, Grid, Icon, Input, Segment } = components;

const VideoSplitter = ({
  video,
  index,
  segmentColors,
  minSegmentDuration,
}: {
  video: data.Video,
  index: number,
  segmentColors: Array<string>,
  minSegmentDuration: number,
}) => {
  const [segments, setSegments] = React.useState(video.segments);
  invariant(segments.length > 0, 'at least one segment required');
  invariant(index >= 0, 'negative index');
  invariant(index < segments.length, 'index larger than the number of segments');

  const updateSegmentAt = (i, data: $Shape<db.VideoSegment>) => {
    const newSegments = segments.slice();
    Object.assign(newSegments[i], data);
    if ('end' in data && i + 1 < newSegments.length) {
      Object.assign(newSegments[i + 1], { start: data.end });
    }
    setSegments(newSegments);
  };

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
                    key={data.index}
                    active={data.index === index}
                    data={data}
                    color={segmentColors[data.index]}
                    onSelect={() => utils.history.push(`/edit/${video.data.id}/${data.index}`)}
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
                    id: data.Video.getSegmentId(video.data.id, newSegments.length),
                    videoId: video.data.id,
                    index: newSegments.length,
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
                disabled={index !== segments.length - 1 || segments.length === 1}
                onClick={() => {
                  // only allow if last segment is being edited
                  if (index !== segments.length - 1 || segments.length === 1) {
                    return;
                  }
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
                width={2000} // TODO make dependant on video duration
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
