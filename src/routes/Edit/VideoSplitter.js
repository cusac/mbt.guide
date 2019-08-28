// @flow

import * as components from 'components';
import * as data from 'data';
import * as db from 'services/db';
import * as React from 'react';
import * as utils from 'utils';
import * as services from 'services';
import Swal from 'sweetalert2';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import invariant from 'invariant';
import { v4 as uuid } from 'uuid';

import VideoSegment from './VideoSegment';

const {
  Button,
  Grid,
  Icon,
  Input,
  Segment,
  Form,
  TextArea,
  Link,
  AppHeader,
  Container,
  Label,
} = components;

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

  React.useEffect(() => {
    !segmentId && addSegment();
  }, []);

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
    segmentId = newId;
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
      Swal.fire({
        title: 'Saved!',
        text: 'Your changes have been saved.',
        type: 'success',
        confirmButtonText: 'OK',
      });
    } catch (e) {
      alert(String(e));
    }
  };

  const segment = segments.find(s => s.id === segmentId);

  const owner = segment ? user.email === segment.createdBy : false;

  const index = segments.indexOf(segment);
  const { duration } = video.data;

  return (
    <div>
      <AppHeader />
      <Container style={{ marginTop: 20 }}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={11} style={{ padding: 0 }}>
              <components.YouTubePlayerWithControls
                duration={video.data.duration}
                end={segment ? segment.end : video.data.duration}
                start={segment ? segment.start : 0}
                videoId={video.data.id}
              />
            </Grid.Column>
            <Grid.Column width={5}>
              <Segment attached style={{ height: '385px', overflowY: 'auto' }}>
                <Segment.Group>
                  {segments.map((data, i) => (
                    <VideoSegment
                      key={data.id}
                      active={data.id === segmentId}
                      data={data}
                      color={segmentColors[i % segmentColors.length]}
                      onSelect={() => utils.history.push(`/edit/${video.data.id}/${data.id}`)}
                      canEdit={user.email === data.createdBy}
                    />
                  ))}
                </Segment.Group>
              </Segment>
              <Button.Group attached="bottom">
                <Button onClick={addSegment}>
                  <Icon name="add" /> Add
                </Button>
                <Button
                  disabled={segments.length <= 0 || !user || (segment && !owner)}
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
        </Grid>
        {segment ? (
          <div>
            <Grid relaxed style={{ marginTop: 20 }}>
              {!owner && (
                <Grid.Row>
                  <Grid.Column>
                    <Segment color="red" style={{ color: 'red' }}>
                      Only the creator of a segment can edit it.
                    </Segment>
                  </Grid.Column>
                </Grid.Row>
              )}
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
                      disabled={!user || !owner}
                      key={segments.length} // causes slider recreation on segments count change
                      range={{ min: 0, max: duration }}
                      onHandleSet={(i, value) =>
                        updateSegmentAt(index, i ? { end: value } : { start: value })
                      }
                      start={[segment.start, segment.end]}
                      colors={[segmentColors[index % segmentColors.length]]}
                      margin={minSegmentDuration}
                      width={1000} // TODO make dependant on video duration
                      pips
                    />
                  </div>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column verticalAlign="middle" style={{ textAlign: 'right' }} width={2}>
                  <Label>Creator:</Label>
                </Grid.Column>
                <Grid.Column width={8}>
                  <Input
                    disabled={true}
                    className="segment-field"
                    fluid
                    value={segment.createdBy}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column verticalAlign="middle" style={{ textAlign: 'right' }} width={2}>
                  <Label>Title:</Label>
                </Grid.Column>
                <Grid.Column width={8}>
                  <Input
                    className="segment-field"
                    disabled={!user || !owner}
                    fluid
                    placeholder="Title"
                    value={segments[index].title}
                    onChange={(event, { value }) => updateSegmentAt(index, { title: value })}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column verticalAlign="top" style={{ textAlign: 'right' }} width={2}>
                  <Label>Description:</Label>
                </Grid.Column>
                <Grid.Column width={14}>
                  <Form>
                    <TextArea
                      className="segment-field"
                      disabled={!user || !owner}
                      style={{ color: !owner && 'darkgray' }}
                      placeholder="Enter a description"
                      value={segments[index].description}
                      onChange={(event, { value }) =>
                        updateSegmentAt(index, { description: value })
                      }
                    />
                  </Form>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column verticalAlign="middle" style={{ textAlign: 'right' }} width={2}>
                  <Label>Tags:</Label>
                </Grid.Column>
                <Grid.Column width={14}>
                  <div className="segment-field" disabled={!user || !owner}>
                    <TagsInput
                      disabled={!user || !owner}
                      value={segments[index].tags}
                      onChange={tags => updateSegmentAt(index, { tags })}
                    />
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        ) : (
          <Grid>
            <Grid.Row>
              <Grid.Column verticalAlign="middle" width={16}>
                <Segment style={{ padding: 10, marginTop: 20 }}>
                  No segments yet. <Link onClick={addSegment}>Add the first one!</Link>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default VideoSplitter;
