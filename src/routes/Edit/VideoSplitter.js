// @flow

import * as components from 'components';
import * as data from 'data';
import * as db from 'services/db';
import React, { useGlobal } from 'reactn';
import * as utils from 'utils';
import * as services from 'services';
import Swal from 'sweetalert2';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import InputMask from 'react-input-mask';
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
  const [refresh, setRefresh] = React.useState([true]);
  const [currentUser] = useGlobal('user');

  const { duration } = video.data;

  const segment = segments.find(s => s.id === segmentId);

  const owner = segment && currentUser ? currentUser.email === segment.createdBy : false;

  const index = segments.indexOf(segment);

  const startRef = React.createRef();
  const endRef = React.createRef();

  const goTo = path => {
    utils.history.push(path);
  };

  !segment && segments.length > 0 && goTo(`/edit/${video.data.id}/${segments[0].id}`);

  const updateSegmentAt = (index, data: $Shape<db.VideoSegment>) => {
    const newSegments = segments.slice();
    Object.assign(newSegments[index], { ...data, pristine: false });
    startRef.current &&
      startRef.current.value &&
      (startRef.current.value = utils.timeFormat.to(data.start));
    endRef.current &&
      endRef.current.value &&
      (endRef.current.value = utils.timeFormat.to(data.end));
    setSegments(newSegments);
    setSaveData(true);
  };

  const updateStart = (index, value) => {
    const start = utils.timeFormat.from(value);
    start && updateSegmentAt(index, { start });
  };

  const updateEnd = (index, value) => {
    const end = utils.timeFormat.from(value);
    end && updateSegmentAt(index, { end });
  };

  const addSegment = () => {
    const newSegments = segments.slice();
    const newId = uuid();
    newSegments.push({
      id: newId,
      videoId: video.data.id,
      start: duration * 0.25,
      end: duration * 0.75,
      title: 'New segment title',
      tags: [],
      description: '',
      createdBy: currentUser.email,
      pristine: true,
    });
    setSegments(newSegments);
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
        const newSegments = segments.filter(s => segment && s.id !== segment.id);
        video.updateSegments(newSegments, setSegments);
        Swal.fire('Deleted!', 'Your segment has been deleted.', 'success');
        goTo(`/edit/${video.data.id}/${newSegments[0].id}`);
      }
    });
  };

  const saveChanges = async () => {
    try {
      await video.updateSegments(segments, setSegments);
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

  const saveIfNeeded = async () => {
    if (saveData) {
      await video.updateSegments(segments, setSegments);
      setSaveData(false);
    }
  };

  // Keep start/end input fields in sync
  React.useEffect(() => {
    segment && startRef.current && (startRef.current.value = utils.timeFormat.to(segment.start));
    segment && endRef.current && (endRef.current.value = utils.timeFormat.to(segment.end));
    // Update the state to make sure things are rendered properly
    setRefresh(refresh.slice());
  }, [segments, index]);

  // Autosave data every 5s if needed
  React.useEffect(() => {
    const stopSaving = setInterval(saveIfNeeded, 5000);
    return () => clearInterval(stopSaving);
  }, [saveData]);

  React.useEffect(() => {
    !segmentId && currentUser && addSegment();
  }, []);

  if (!currentUser) {
    return (
      <div>
        <AppHeader />
        <Header style={{ marginTop: 50 }}>
          <h1>You must sign in to create segments!</h1>
        </Header>
      </div>
    );
  }

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
                      canEdit={currentUser.email === data.createdBy}
                    />
                  ))}
                </Segment.Group>
              </Segment>
              <Button.Group attached="bottom">
                <Button onClick={addSegment}>
                  <Icon name="add" /> Add
                </Button>
                <Button
                  disabled={segments.length <= 0 || !currentUser || (segment && !owner)}
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
                      disabled={!currentUser || !owner}
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
                  <Label>Video:</Label>
                </Grid.Column>
                <Grid.Column width={8}>
                  <Input
                    disabled={true}
                    className="segment-field"
                    fluid
                    value={video.data.youtube.snippet.title}
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
                    disabled={!currentUser || !owner}
                    fluid
                    placeholder="Title"
                    value={segments[index].title}
                    onChange={(event, { value }) => updateSegmentAt(index, { title: value })}
                  />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column verticalAlign="middle" style={{ textAlign: 'right' }} width={2}>
                  <Label>Start - End:</Label>
                </Grid.Column>
                <Grid.Column width={4} style={{ textAlign: 'left' }}>
                  <InputMask
                    disabled={!currentUser || !owner}
                    ref={startRef}
                    className="segment-time-field"
                    mask="99:99:99"
                    defaultValue={utils.timeFormat.to(segment.start)}
                    onChange={event => updateStart(index, event.target.value)}
                  />{' '}
                  -{' '}
                  <InputMask
                    disabled={!currentUser || !owner}
                    ref={endRef}
                    className="segment-time-field"
                    mask="99:99:99"
                    defaultValue={utils.timeFormat.to(segment.end)}
                    onChange={event => updateEnd(index, event.target.value)}
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
                      disabled={!currentUser || !owner}
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
                  <div className="segment-field" disabled={!currentUser || !owner}>
                    <TagsInput
                      disabled={!currentUser || !owner}
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
