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
  Loading,
  Header,
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
    return (
      <div>
        <AppHeader />
        <Loading>Creating video...</Loading>
      </div>
    );
  }
  const [segments, setSegments] = React.useState(video.segments);
  const [saveData, setSaveData] = React.useState(false);

  const { duration } = video.data;

  const user = services.auth.currentUser;

  const saveIfNeeded = async () => {
    if (saveData) {
      await video.updateSegments(segments);
      setSaveData(false);
    }
  };

  // Autosave data every 5s if needed
  React.useEffect(() => {
    const stopSaving = setInterval(saveIfNeeded, 5000);
    return () => clearInterval(stopSaving);
  }, [saveData]);

  const updateSegmentAt = (index, data: $Shape<db.VideoSegment>) => {
    const newSegments = segments.slice();
    Object.assign(newSegments[index], data);
    setSegments(newSegments);
    setSaveData(true);
  };

  const addSegment = () => {
    const newSegments: any = segments.slice();
    const newId = uuid();
    newSegments.push({
      id: newId,
      videoId: video.data.id,
      start: duration * 0.25,
      end: duration * 0.75,
      title: 'New segment title',
      tags: [],
      description: '',
      createdBy: user.email,
      pristine: true,
    });
    setSegments(newSegments);
    segmentId = newId;
    goTo(`/edit/${video.data.id}/${newId}`);
  };

  const removeSegment = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(result => {
      if (result.value) {
        const newSegments = segments.filter(s => s !== segment);
        setSegments(newSegments);
        goTo(`/edit/${video.data.id}/${newSegments[newSegments.length - 1].id}`);
        video.updateSegments(newSegments);
        Swal.fire('Deleted!', 'Your segment has been deleted.', 'success');
      }
    });
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

  const goTo = path => {
    utils.history.push(path);
  };

  React.useEffect(() => {
    !segmentId && addSegment();
  }, []);

  if (!user) {
    return (
      <div>
        <AppHeader />
        <Header style={{ marginTop: 50 }}>
          <h1>You must sign in to create segments!</h1>
        </Header>
      </div>
    );
  }

  const segment = segments.find(s => s.id === segmentId);

  const owner = segment ? user.email === segment.createdBy : false;

  const index = segments.indexOf(segment);

  return (
    <div>
      <AppHeader currentVideoId={videoId} />
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
                      onSelect={() => goTo(`/edit/${video.data.id}/${data.id}`)}
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
