// @flow

import * as components from 'components';
import * as data from 'data';
import * as db from 'services/db';
import * as React from 'react';
import * as utils from 'utils';
import * as services from 'services';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import invariant from 'invariant';
import { v4 as uuid } from 'uuid';

import VideoSegment from './VideoSegment';

const { Button, Grid, Icon, Input, Segment, Form, TextArea, Link, AppHeader } = components;

const VideoSplitter = ({
  video,
  videoId,
  segmentId,
  segmentColors,
  minSegmentDuration,
}: {
  video: data.Video,
  videoId: string,
  segmentId: string,
  segmentColors: Array<string>,
  minSegmentDuration: number,
}) => {
  if (!video.data) {
    data.Video.create(videoId);
    return <div>Creating video...</div>;
  }
  const [segments, setSegments] = React.useState(video.segments);

  const user = services.auth.currentUser;

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
      tags: [],
      description: '',
      createdBy: user.email,
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

  const index = segments.indexOf(segment);
  const { duration } = video.data;

  return (
    <div>
      <AppHeader />
      <Grid>
        <Grid.Row style={{ height: 420 }}>
          <Grid.Column width={10} style={{ padding: 0, marginLeft: 20 }}>
            <components.YouTubePlayerWithControls
              duration={video.data.duration}
              end={segment ? segment.end : video.data.duration}
              start={segment ? segment.start : 0}
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
              <Button onClick={addSegment}>
                <Icon name="add" /> Add
              </Button>
              <Button
                disabled={
                  segments.length <= 0 || !user || (segment && user.email !== segment.createdBy)
                }
                color="red"
                onClick={removeSegment}
              >
                <Icon name="trash alternate outline" /> Remove
              </Button>
              <Button color="green" onClick={saveChanges}>
                <Icon name="save" /> Save
              </Button>
            </Button.Group>
          </Grid.Column>
        </Grid.Row>
        {segment ? (
          <div>
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
                    disabled={!user || user.email !== segment.createdBy}
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
                Owner
              </Grid.Column>
              <Grid.Column width={7}>
                <Input disabled={true} fluid value={segment.createdBy} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column style={{ color: 'white ' }} verticalAlign="middle" width={3}>
                Title
              </Grid.Column>
              <Grid.Column width={7}>
                <Input
                  disabled={!user || user.email !== segment.createdBy}
                  fluid
                  placeholder="Title"
                  value={segments[index].title}
                  onChange={(event, { value }) => updateSegmentAt(index, { title: value })}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column style={{ color: 'white ' }} verticalAlign="middle" width={3}>
                Description
              </Grid.Column>
              <Grid.Column width={13}>
                <Form>
                  <TextArea
                    disabled={!user || user.email !== segment.createdBy}
                    placeholder="Enter a description"
                    value={segments[index].description}
                    onChange={(event, { value }) => updateSegmentAt(index, { description: value })}
                  />
                </Form>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column style={{ color: 'white ' }} verticalAlign="middle" width={3}>
                Tags
              </Grid.Column>
              <Grid.Column width={13}>
                <TagsInput
                  disabled={!user || user.email !== segment.createdBy}
                  value={segments[index].tags}
                  onChange={tags => updateSegmentAt(index, { tags })}
                />
              </Grid.Column>
            </Grid.Row>
          </div>
        ) : (
          <Grid.Row>
            <Grid.Column verticalAlign="middle" width={16}>
              <Segment style={{ padding: 10, marginTop: 20 }}>
                No segments yet. <Link onClick={addSegment}>Add the first one!</Link>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        )}
      </Grid>
    </div>
  );
};

export default VideoSplitter;
