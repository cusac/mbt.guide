import {
  Button,
  Container,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Label,
  Link,
  Loading,
  Modal,
  SegmentUI,
  Slider,
  TextArea,
  YouTubePlayerWithControls,
} from 'components';
import { differenceBy, uniq } from 'lodash';
import React from 'react';
import InputMask from 'react-input-mask';
import { useSelector } from 'react-redux';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import { repository } from 'services';
import {
  createVideo,
  RootState,
  setLastViewedSegmentId,
  setShowSearchbar,
  updateSegments,
  useAppDispatch,
} from 'store';
import Swal from 'sweetalert2';
import { Segment, Video } from 'types';
import { captureAndLog, hasPermission, history, timeFormat, toastError } from 'utils';
import { v4 as uuid } from 'uuid';
import VideoSegmentItem from './VideoSegmentItem';

//TODO: Error Handling

// TODO: Split into multiple components to fix typescript errors?

const VideoSplitter = ({
  videoId,
  segmentId,
  segmentColors,
  minSegmentDuration,
}: {
  videoId: string;
  segmentId: string;
  segmentColors: Array<string>;
  minSegmentDuration: number;
}) => {
  const [video, setVideo]: [Video | undefined, any] = React.useState();
  const [videoLoading, setVideoLoading]: [boolean, any] = React.useState(false);
  const [segments, setSegments]: [Segment[], any] = React.useState([]);
  const [currentSegment, setCurrentSegment]: [Segment | undefined, any] = React.useState();
  const [saveData, setSaveData]: [boolean, any] = React.useState(false);
  const [segmentsSaving, setSegmentsSaving]: [boolean, any] = React.useState(false);
  const [refresh, setRefresh]: [[boolean], any] = React.useState([true]);
  const [newVid, setNewVid]: [boolean, any] = React.useState(false);
  const [newVidCreating, setnewVidCreating]: [boolean, any] = React.useState(false);
  const [wait, setWait]: [boolean, any] = React.useState(true);
  const [error, setError] = React.useState();

  // TODO: REPLACE WITH STORE AND CHECK "PROCESSED VIDEO" FILTER AND TEST STORE CALLS THROW eRRORS

  const dispatch = useAppDispatch();

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const currentUserScope = useSelector((state: RootState) => state.auth.scope);
  const lastViewedSegmentId = useSelector((state: RootState) => state.video.lastViewedSegmentId);

  const startRef: any = React.createRef();
  const endRef: any = React.createRef();

  React.useEffect(() => {
    dispatch(setShowSearchbar({ showSearchbar: false }));
    segmentId &&
      segmentId !== lastViewedSegmentId &&
      dispatch(setLastViewedSegmentId({ lastViewedSegmentId: segmentId }));
  }, []);

  const updateSegmentAt = (index: any, data: any) => {
    const newSegments = (segments as any).slice();
    Object.assign(newSegments[index], { ...data, pristine: false });
    startRef.current &&
      startRef.current.value &&
      (startRef.current.value = timeFormat.to(data.start as any));
    endRef.current &&
      endRef.current.value &&
      (endRef.current.value = timeFormat.to(data.end as any));
    setSegments(newSegments);
    setSaveData(true);
  };

  const updateTags = (index: any, tags: string[], rank: number) => {
    // Remove duplicates
    tags = uniq(tags);
    // Remove old tag if rank changed
    (currentSegment as any).tags = differenceBy(
      (currentSegment as any).tags,
      tags.map((t: any) => ({ tag: { name: t } })),
      'tag.name'
    );
    // Keep segments of other ranks
    (currentSegment as any).tags = (currentSegment as any).tags.filter((t: any) => t.rank !== rank);
    // Add new tags to old
    tags = [
      ...(currentSegment as any).tags,
      ...tags.map((t: any) => ({ tag: { name: t }, rank })),
    ] as any;
    updateSegmentAt(index, { ...currentSegment, tags });
  };

  const updateStart = (index: any, value: any) => {
    const start = timeFormat.from(value);
    start && updateSegmentAt(index, { start });
  };

  const updateEnd = (index: any, value: any) => {
    const end = timeFormat.from(value);
    end && updateSegmentAt(index, { end });
  };

  const addSegment = async () => {
    const newSegments: any = (segments as any).slice();
    const newId = uuid();
    const hasNoCurSeg = currentSegment === undefined;
    let lastSegEnd = hasNoCurSeg ? 0 : currentSegment?.end;
    // This prevents an error that occurs when start === end
    lastSegEnd = lastSegEnd === duration ? lastSegEnd - 1 : lastSegEnd;

    newSegments.push({
      segmentId: newId,
      video: (video as any)._id,
      // TODO: Make start and end profile settings. Below is volunteer specific
      start: Number(lastSegEnd), //duration * 0.25,
      end: duration, // * 0.75,
      title: 'New segment title',
      ownerEmail: currentUser ? currentUser.email : '',
      tags: [],
      description: '',
      pristine: true,
    });
    setSegments(newSegments);
    goTo(`/edit/${(video as any).ytId}/${newId}`);
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
    }).then(async result => {
      if (result.value) {
        try {
          const newSegments = (segments as any).filter(
            (s: any) => currentSegment && s.segmentId !== (currentSegment as any).segmentId
          );

          setSegmentsSaving(true);
          const updatedSegments = await dispatch(
            updateSegments({
              videoId,
              segments: newSegments,
            })
          );

          setSegmentsSaving(false);
          setSegments(updatedSegments);
          Swal.fire('Deleted!', 'Your segment has been deleted.', 'success');
          goTo(`/edit/${(video as any).ytId}/${(newSegments[0] || {}).segmentId}`);
        } catch (err) {
          setSegmentsSaving(false);
          captureAndLog({ file: 'VideoSplitter', method: 'removeSegment', err });
          toastError('There was an error deleting the segment.', err);
        }
      }
    });
  };

  const saveChanges = async () => {
    try {
      setSegmentsSaving(true);
      const updatedSegments = await dispatch(
        updateSegments({
          videoId,
          segments,
        })
      );
      setSegmentsSaving(false);
      setSegments(updatedSegments);
      Swal.fire({
        title: 'Saved!',
        text: 'Your changes have been saved.',
        type: 'success',
        confirmButtonText: 'OK',
      });
    } catch (err) {
      setSegmentsSaving(false);
      captureAndLog({ file: 'VideoSplitter', method: 'saveChanges', err });
      toastError('There was an error updating the segment.', err);
    }

    setSaveData(false);
  };

  const saveIfNeeded = async () => {
    if (saveData) {
      try {
        //TODO: make sure segments are updated in the local state so they change in the UI
        await dispatch(
          updateSegments({
            videoId,
            segments,
          })
        );
        setSaveData(false);
      } catch (err) {
        //TODO: make sure error is thrown above
        if (err && err.message !== 'Network Error') {
          // Continue to attempt saving if the error is due to a bad network.
          setSaveData(false);
        }
        captureAndLog({ file: 'VideoSplitter', method: 'saveIfNeeded', err });
      }
    }
  };

  const getVideoData = async (videoId: any) => {
    try {
      if (!videoLoading) {
        setVideoLoading(true);
        const [video] = (
          await repository.video.list({
            ytId: videoId,
            $embed: ['segments.tags'],
          })
        ).data.docs;
        setVideoLoading(false);

        if (!video) {
          setNewVid(true);
        } else {
          setVideo(video);
          setSegments((video as any).segments);
        }
      }
    } catch (err) {
      captureAndLog({ file: 'VideoSplitter', method: 'getVideoData', err });
      setError(err);
    }
  };

  const goTo = (path: any) => {
    history.push(path);
  };

  // Keep start/end input fields in sync
  React.useEffect(() => {
    currentSegment &&
      startRef.current &&
      (startRef.current.value = timeFormat.to((currentSegment as any).start));
    currentSegment &&
      endRef.current &&
      (endRef.current.value = timeFormat.to((currentSegment as any).end));
    // Update the state to make sure things are rendered properly
    setRefresh(refresh.slice());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSegment, segments]);

  // Autosave data every 5s if needed
  React.useEffect(() => {
    const stopSaving = setInterval(saveIfNeeded, 5000);
    return () => clearInterval(stopSaving);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveData]);

  React.useEffect(() => {
    dispatch(setLastViewedSegmentId({ lastViewedSegmentId: segmentId }));
    segments && setCurrentSegment((segments as any).find((s: any) => s.segmentId === segmentId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segmentId, segments]);

  if (!currentUser) {
    return (
      <div>
        <Header style={{ marginTop: 50 }}>
          <h1>You must sign in to create segments!</h1>
        </Header>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header>There was an error loading the video. Please refresh the page.</Header>
      </div>
    );
  }

  if (newVid) {
    !newVidCreating &&
      dispatch(createVideo({ videoId }))
        .then((_: any) => {
          setNewVid(false);
          setnewVidCreating(false);
          getVideoData(videoId);
        })
        .catch((err: any) => {
          setNewVid(false);
          setnewVidCreating(false);
          setError(err);
        });
    !newVidCreating && setnewVidCreating(true);
    return (
      <div>
        <Loading>Creating video...</Loading>
      </div>
    );
  }

  if (!video) {
    getVideoData(videoId);
    return (
      <div>
        <Loading>Loading video...</Loading>
      </div>
    );
  }

  if (wait) {
    setTimeout(() => {
      setWait(false);
    }, 500);
    return (
      <div>
        <Loading>Loading player...</Loading>
      </div>
    );
  }

  const { duration } = video;
  const canEdit =
    currentSegment && currentUser
      ? currentUser.email === (currentSegment as any).ownerEmail ||
        hasPermission({ currentScope: currentUserScope, requiredScope: ['Admin'] })
      : false;

  const index = (segments as any).indexOf(currentSegment);

  !currentSegment &&
    (segments as any).length > 0 &&
    goTo(`/edit/${(video as any).ytId}/${segments[0].segmentId}`);

  if (currentSegment && index < 0) {
    return (
      <div>
        <Header>Loading segment...</Header>
      </div>
    );
  }

  return (
    <div>
      <Container style={{ marginTop: 20 }}>
        <Modal open={segmentsSaving} size="mini">
          <Container style={{ height: 150, marginTop: 50 }} textAlign="center">
            <Loading>Saving Changes...</Loading>
          </Container>
        </Modal>

        <Grid>
          <Grid.Row>
            <Grid.Column width={11} style={{ padding: 0 }}>
              {video && (
                <YouTubePlayerWithControls
                  duration={(video as any).duration}
                  end={currentSegment ? (currentSegment as any).end : (video as any).duration}
                  start={currentSegment ? (currentSegment as any).start : 0}
                  videoId={(video as any).ytId}
                />
              )}
            </Grid.Column>
            <Grid.Column width={5}>
              <SegmentUI attached style={{ height: '385px', overflowY: 'auto' }}>
                <SegmentUI.Group>
                  {(segments as any).map((data: any, i: any) => (
                    <VideoSegmentItem
                      key={data.segmentId}
                      active={data.segmentId === segmentId}
                      data={data}
                      color={segmentColors[i % segmentColors.length]}
                      onSelect={() => goTo(`/edit/${(video as any).ytId}/${data.segmentId}`)}
                      canEdit={currentUser.email === data.ownerEmail}
                    />
                  ))}
                </SegmentUI.Group>
              </SegmentUI>
              <Button.Group attached="bottom">
                <Button onClick={addSegment} color="blue">
                  <Icon name="add" /> Add
                </Button>
                <Button
                  disabled={
                    (segments as any).length <= 0 || !currentUser || (currentSegment && !canEdit)
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
        </Grid>
        {currentSegment ? (
          <div>
            <Grid relaxed style={{ marginTop: 20 }}>
              {!canEdit && (
                <Grid.Row>
                  <Grid.Column>
                    <SegmentUI color="red" style={{ color: 'red' }}>
                      Only the creator of a segment can edit it.
                    </SegmentUI>
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
                    <Slider
                      disabled={!currentUser || !canEdit}
                      key={(segments as any).length} // causes slider recreation on segments count change
                      range={{ min: 0, max: duration }}
                      onHandleSet={(i: any, value: any) =>
                        updateSegmentAt(index, i ? { end: value } : { start: value })
                      }
                      start={[(currentSegment as any).start, (currentSegment as any).end]}
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
                    value={(currentSegment as any).ownerEmail}
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
                    value={(video as any).youtube.snippet.title}
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
                    disabled={!currentUser || !canEdit}
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
                    disabled={!currentUser || !canEdit}
                    ref={startRef}
                    className="segment-time-field"
                    mask="99:99:99"
                    defaultValue={timeFormat.to((currentSegment as any).start)}
                    onChange={(event: any) => updateStart(index, event.target.value)}
                  />{' '}
                  -{' '}
                  <InputMask
                    disabled={!currentUser || !canEdit}
                    ref={endRef}
                    className="segment-time-field"
                    mask="99:99:99"
                    defaultValue={timeFormat.to((currentSegment as any).end)}
                    onChange={(event: any) => updateEnd(index, event.target.value)}
                  />
                </Grid.Column>
                <Grid.Column
                  verticalAlign="middle"
                  style={{ textAlign: 'right', color: 'black' }}
                  width={6}
                >
                  <Icon name="help circle" />
                  Tip : Type e.g. 012030 without : or spaces to enter 01:20:30.
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
                      disabled={!currentUser || !canEdit}
                      style={{ color: !canEdit && 'darkgray' }}
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
                  <h2>High Relevance</h2>
                  <div className="segment-field" data-disabled={!currentUser || !canEdit}>
                    <TagsInput
                      disabled={!currentUser || !canEdit}
                      value={(currentSegment as any).tags
                        .filter((t: any) => t.rank === 11)
                        .map((t: any) => t.tag.name)}
                      onChange={(tags: any) => updateTags(index, tags, 11)}
                    />
                  </div>
                  <h2>Mid Relevance</h2>
                  <div className="segment-field" data-disabled={!currentUser || !canEdit}>
                    <TagsInput
                      disabled={!currentUser || !canEdit}
                      value={(currentSegment as any).tags
                        .filter((t: any) => t.rank === 6)
                        .map((t: any) => t.tag.name)}
                      onChange={(tags: any) => updateTags(index, tags, 6)}
                    />
                  </div>
                  <h2>Low Relevance</h2>
                  <div className="segment-field" data-disabled={!currentUser || !canEdit}>
                    <TagsInput
                      disabled={!currentUser || !canEdit}
                      value={(currentSegment as any).tags
                        .filter((t: any) => t.rank === 1)
                        .map((t: any) => t.tag.name)}
                      onChange={(tags: any) => updateTags(index, tags, 1)}
                    />
                  </div>
                  <p>
                    <br />
                    <Icon name="help circle" />
                    Tip : Type a phrase and press Tab key to commit.
                    <br />
                  </p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        ) : (
          <Grid>
            <Grid.Row>
              <Grid.Column verticalAlign="middle" width={16}>
                <SegmentUI style={{ padding: 10, marginTop: 20 }}>
                  No segments yet.{' '}
                  <Link onClick={addSegment} to="">
                    Add the first one!
                  </Link>
                </SegmentUI>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default VideoSplitter;
