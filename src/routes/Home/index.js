// @flow

import * as components from 'components';
import * as utils from 'utils';
import React, { useGlobal } from 'reactn';
import * as services from 'services';
import * as errors from 'errors';

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
  const [segments, setSegments] = React.useState((undefined: Array<VideoSegment> | void));
  const [mySegments, setMySegments] = React.useState((undefined: Array<VideoSegment> | void));
  const [selectedVideo, setSelectedVideo] = React.useState();
  const [videos, setVideos] = React.useState([]);
  const [segmentVideo, setSegmentVideo] = React.useState();
  const [currentUser] = useGlobal('user');

  const selectVideo = async videoId => {
    const [video] = await services.youtube({
      endpoint: 'videos',
      params: {
        id: videoId,
      },
    });
    setSelectedVideo(video);
    video && utils.history.push(`/${videoId}`);
  };

  React.useEffect(() => {
    // We grab videos from the MBT 'uploads' playlist to save on youtube api search quota points
    async function fetchVideos() {
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
    }
    fetchVideos();
  }, []);

  React.useEffect(() => {
    async function fetchSelectedVideo() {
      const [video] = await services.youtube({
        endpoint: 'videos',
        params: {
          id: videoId,
        },
      });
      setSelectedVideo(video);
    }
    videoId && fetchSelectedVideo();
  }, [videoId]);

  React.useEffect(() => {
    const fetchSegmentVideo = async () => {
      const video = (await services.repository.video.list({
        ytId: videoId,
        $embed: ['segments'],
      })).data.docs[0];
      video ? setSegmentVideo(video) : setSegments([]);
    };
    selectedVideo ? fetchSegmentVideo() : setSegments([]);
  }, [selectedVideo]);

  React.useEffect(() => {
    setSegments(segmentVideo ? segmentVideo.segments : []);
  }, [segmentVideo]);

  React.useEffect(() => {
    segments &&
      setMySegments(segments.filter(s => currentUser && s.ownerEmail === currentUser.email));
  }, [segments]);

  if (videos.length === 0) {
    return (
      <div>
        <AppHeader showSearchbar={true} />
        <Loading>Loading videos...</Loading>
      </div>
    );
  }

  const videoSrc = selectedVideo
    ? `https://www.youtube.com/embed/${selectedVideo.id.videoId || selectedVideo.id}`
    : '';

  const searchVideos = async term => {
    const response = await services.youtube({
      endpoint: 'search',
      params: {
        q: term,
      },
    });

    const mbtVids = response.filter(v => v.snippet.channelId === channelId);
    setVideos(mbtVids);
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

            <Button color="teal" size="big" onClick={() => utils.history.push(`/edit/${videoId}`)}>
              <Icon name="plus" /> New Segment
            </Button>

            <br />

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
                            utils.history.push(`/watch/${segment.videoYtId}/${segment.segmentId}`)
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
                  No segments for this video. <Link onClick={createVideo}>Add the first one!</Link>
                </div>
              )
            )}
          </Grid.Column>
          <Grid.Column style={{ color: 'white' }} verticalAlign="middle" width={4}>
            <VideoList
              videos={videos}
              handleVideoSelect={video => video && selectVideo(video.id.videoId)}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default Home;
