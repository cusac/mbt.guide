// @flow

import * as components from 'components';
import * as utils from 'utils';
import React, { useGlobal } from 'reactn';
import * as services from 'services';
import * as errors from 'errors';
import { captureAndLog, toastError } from 'utils';

import type { Video, VideoSegment } from 'types';

const channelId = 'UCYwlraEwuFB4ZqASowjoM0g';

const {
  Button,
  Link,
  Grid,
  AppHeader,
  VideoList,
  Header,
  Icon,
  Container,
  Divider,
  Loading,
} = components;

const Home = ({ videoId }: { videoId: string }) => {
  const [error, setError] = React.useState();
  const [loadingVideos, setLoadingVideos] = React.useState(true);
  const [loadingSelectedVideo, setLoadingSelectedVideo] = React.useState(true);
  const [loadingSegments, setLoadingSegments] = React.useState(true);
  const [segments, setSegments] = React.useState((undefined: Array<VideoSegment> | void));
  const [mySegments, setMySegments] = React.useState((undefined: Array<VideoSegment> | void));
  const [selectedVideo, setSelectedVideo] = React.useState();
  const [videos, setVideos] = React.useState([]);
  const [segmentVideo, setSegmentVideo] = React.useState();
  const [currentUser] = useGlobal('user');

  const selectVideo = async videoId => {
    utils.history.push(`/${videoId}`);
  };

  // Fetch the default list of videos from the MBT uploads list
  React.useEffect(() => {
    // We grab videos from the MBT 'uploads' playlist to save on youtube api search quota points
    async function fetchVideos() {
      try {
        setLoadingVideos(true);
        const response = await services.youtube({
          endpoint: 'playlistItems',
          params: {
            playlistId: 'UUYwlraEwuFB4ZqASowjoM0g',
          },
        });
        const mbtVids = response.map(v => ({
          snippet: v.snippet,
          id: {
            videoId: v.snippet.resourceId.videoId,
          },
        }));
        setVideos(mbtVids);
        !videoId && selectVideo(`_ok27SPHhwA`);
      } catch (err) {
        captureAndLog('Home', 'fetchVideos', err);
        toastError(
          'There was an error fetching youtube data. Please refresh the page and try again.',
          err
        );
      } finally {
        setLoadingVideos(false);
      }
    }
    fetchVideos();
  }, []);

  // Fetch the selected video from youtube
  React.useEffect(() => {
    async function fetchSelectedVideo() {
      try {
        setLoadingSelectedVideo(true);
        const [video] = await services.youtube({
          endpoint: 'videos',
          params: {
            id: videoId,
          },
        });
        setSelectedVideo(video);
      } catch (err) {
        setLoadingSelectedVideo(false);
        captureAndLog('Home', 'fetchSelectedVideo', err);
        toastError(
          'There was an error fetching youtube data. Please refresh the page and try again.',
          err
        );
      } finally {
        setLoadingSelectedVideo(false);
      }
    }
    videoId && fetchSelectedVideo();
  }, [videoId]);

  // Get the segments for the selected video
  React.useEffect(() => {
    const fetchSegmentVideo = async () => {
      try {
        setLoadingSegments(true);
        const video = (
          await services.repository.video.list({
            ytId: videoId,
            $embed: ['segments'],
          })
        ).data.docs[0];
        video ? setSegmentVideo(video) : setSegments([]);
      } catch (err) {
        captureAndLog('Home', 'fetchSegmentVideo', err);
        toastError(
          'There was an error fetching the selected video data. Please refresh the page and try again.',
          err
        );
      } finally {
        setLoadingSegments(false);
      }
    };
    videoId ? fetchSegmentVideo() : setSegments([]);
  }, [videoId]);

  React.useEffect(() => {
    setSegments(segmentVideo ? segmentVideo.segments : []);
  }, [segmentVideo]);

  React.useEffect(() => {
    segments &&
      setMySegments(segments.filter(s => currentUser && s.ownerEmail === currentUser.email));
  }, [segments, currentUser]);

  const videoSrc = selectedVideo
    ? `https://www.youtube.com/embed/${selectedVideo.id.videoId || selectedVideo.id}`
    : '';

  // Search youtube videos from the MBT channel
  const searchVideos = async term => {
    try {
      setLoadingVideos(true);
      const response = await services.youtube({
        endpoint: 'search',
        params: {
          q: term,
        },
      });

      // Filter out any videos that don't belong to the MBT channel
      const mbtVids = response.filter(v => v.snippet.channelId === channelId);

      setVideos(mbtVids);
    } catch (err) {
      captureAndLog('Home', 'searchVideos', err);
      toastError(
        'There was an error fetching youtube data. Please refresh the page and try again.',
        err
      );
    } finally {
      setLoadingVideos(false);
    }
  };

  const createVideo = () => {
    utils.history.push(`/edit/${videoId}`);
  };

  return (
    <div>
      <AppHeader onHandleSubmit={searchVideos} showSearchbar={true} />
      <Grid>
        <Grid.Row>
          <Grid.Column style={{ marginLeft: 30 }} width={11}>
            {!loadingSelectedVideo ? (
              <div>
                {selectedVideo ? (
                  <div>
                    <div className="ui embed">
                      <iframe src={videoSrc} allowFullScreen title="Video player" />
                    </div>
                    <div className="ui segment">
                      <h4 className="ui header">{selectedVideo.snippet.title}</h4>
                      <p>{selectedVideo.snippet.description}</p>
                    </div>
                  </div>
                ) : (
                  <div>Select a video</div>
                )}
                <br />

                <Button
                  color="teal"
                  size="big"
                  onClick={() => utils.history.push(`/edit/${videoId}`)}
                >
                  <Icon name="plus" /> New Segment
                </Button>

                <br />
                {!loadingSegments ? (
                  <div>
                    {currentUser && (
                      <div>
                        <Divider horizontal>
                          <Header as="h2">
                            <Icon name="user" color="blue" />
                            <Header.Content>Your Segments</Header.Content>
                          </Header>
                        </Divider>
                        {mySegments && mySegments.length > 0 ? (
                          <Container>
                            <Grid celled="internally">
                              <Grid.Row>
                                <Grid.Column verticalAlign="middle" width={3}>
                                  <h4>Segment Title</h4>
                                </Grid.Column>
                                <Grid.Column width={9}>
                                  <h4>Description</h4>
                                </Grid.Column>
                                <Grid.Column width={2}>
                                  <h4>Edit</h4>
                                </Grid.Column>
                                <Grid.Column width={2}>
                                  <h4>Watch</h4>
                                </Grid.Column>
                              </Grid.Row>
                              {mySegments.map(segment => (
                                <Grid.Row key={segment.segmentId}>
                                  <Grid.Column verticalAlign="middle" width={3}>
                                    <Link to={`/watch/${segment.videoYtId}/${segment.segmentId}`}>
                                      {segment.title}
                                    </Link>
                                  </Grid.Column>
                                  <Grid.Column textAlign="left" width={9}>
                                    {segment.description || 'No description available.'}
                                  </Grid.Column>
                                  <Grid.Column width={2}>
                                    <Icon
                                      link={true}
                                      style={{ marginLeft: 10 }}
                                      size="big"
                                      name="edit"
                                      color="blue"
                                      onClick={() =>
                                        utils.history.push(
                                          `/edit/${segment.videoYtId}/${segment.segmentId}`
                                        )
                                      }
                                    />
                                  </Grid.Column>
                                  <Grid.Column width={2}>
                                    <Icon
                                      link={true}
                                      size="big"
                                      name="video play"
                                      color="green"
                                      onClick={() =>
                                        utils.history.push(
                                          `/watch/${segment.videoYtId}/${segment.segmentId}`
                                        )
                                      }
                                    />
                                  </Grid.Column>
                                </Grid.Row>
                              ))}
                            </Grid>
                          </Container>
                        ) : (
                          selectedVideo && (
                            <div>
                              You don't have any segments for this video.{' '}
                              <Link onClick={createVideo}>Try adding one!</Link>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    <Divider horizontal style={{ marginTop: 75 }}>
                      <Header as="h2">
                        <Icon name="video" color="green" />
                        <Header.Content>All Segments</Header.Content>
                      </Header>
                    </Divider>
                    {segments && segments.length > 0 ? (
                      <Container>
                        <Grid celled="internally">
                          <Grid.Row>
                            <Grid.Column verticalAlign="middle" width={3}>
                              <h4>Segment Title</h4>
                            </Grid.Column>
                            <Grid.Column width={11}>
                              <h4>Description</h4>
                            </Grid.Column>
                            <Grid.Column width={2}>
                              <h4>Watch</h4>
                            </Grid.Column>
                          </Grid.Row>
                          {segments.map(segment => (
                            <Grid.Row key={segment.segmentId}>
                              <Grid.Column verticalAlign="middle" width={3}>
                                <Link to={`/watch/${segment.videoYtId}/${segment.segmentId}`}>
                                  {segment.title}
                                </Link>
                              </Grid.Column>
                              <Grid.Column textAlign="left" width={11}>
                                {segment.description || 'No description available.'}
                              </Grid.Column>
                              <Grid.Column width={2}>
                                <Icon
                                  link={true}
                                  size="big"
                                  name="video play"
                                  color="green"
                                  onClick={() =>
                                    utils.history.push(
                                      `/watch/${segment.videoYtId}/${segment.segmentId}`
                                    )
                                  }
                                />
                              </Grid.Column>
                            </Grid.Row>
                          ))}
                        </Grid>
                      </Container>
                    ) : (
                      selectedVideo && (
                        <div>
                          No segments for this video.{' '}
                          <Link onClick={createVideo}>Add the first one!</Link>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <Loading>Loading segments...</Loading>
                )}
              </div>
            ) : (
              <Loading>Loading video...</Loading>
            )}
          </Grid.Column>
          <Grid.Column style={{ color: 'white' }} verticalAlign="middle" width={4}>
            {!loadingVideos ? (
              <div>
                {videos && videos.length > 0 ? (
                  <VideoList
                    videos={videos}
                    handleVideoSelect={video => video && selectVideo(video.id.videoId)}
                  />
                ) : (
                  <h2 style={{ color: 'black' }}>
                    No videos found. Try searching searching for something less specific or if
                    searching for a title make sure the title is exact.{' '}
                  </h2>
                )}
              </div>
            ) : (
              <Loading>Loading videos...</Loading>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default Home;
