// @flow

import * as components from 'components';
import * as data from 'data';
import * as utils from 'utils';
import * as db from 'services/db';
import * as React from 'react';
import * as services from 'services';
import * as errors from 'errors';

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
  const [segments, setSegments] = React.useState((undefined: Array<db.VideoSegment> | void));
  const [mySegments, setMySegments] = React.useState((undefined: Array<db.VideoSegment> | void));
  const [selectedVideo, setSelectedVideo] = React.useState();
  const [videos, setVideos] = React.useState([]);
  const [segmentVideo, setSegmentVideo] = React.useState();

  const selectVideo = async videoId => {
    const response = await services.youtube.get('/videos', {
      params: {
        id: videoId,
      },
    });
    const video = response.data.items[0];
    setSelectedVideo(video);
    video && utils.history.push(`/${videoId}`);
  };

  const user = services.auth.currentUser;

  React.useEffect(() => {
    // We grab videos from the MBT 'uploads' playlist to save on youtube api search quota points
    services.youtube
      .get('/playlistItems', {
        params: {
          playlistId: 'UUYwlraEwuFB4ZqASowjoM0g',
        },
      })
      .then(response => {
        const mbtVids = response.data.items.map(v => ({
          snippet: v.snippet,
          id: {
            videoId: v.snippet.resourceId.videoId,
          },
        }));
        setVideos(mbtVids);
        !videoId && selectVideo(`_ok27SPHhwA`);
      });
  }, []);

  React.useEffect(() => {
    videoId &&
      services.youtube
        .get('/videos', {
          params: {
            id: videoId,
          },
        })
        .then(response => {
          setSelectedVideo(response.data.items[0]);
        });
  }, []);

  React.useEffect(() => {
    error instanceof errors.MissingVideoError && segments && segments.length > 0 && setSegments([]);
  }, [error]);

  React.useEffect(() => {
    selectedVideo &&
      data.Video.subscribe(selectedVideo.id.videoId || selectedVideo.id, setSegmentVideo, setError);
  }, [selectedVideo]);

  React.useEffect(() => {
    setSegments(segmentVideo ? segmentVideo.segments : []);
  }, [segmentVideo]);

  React.useEffect(() => {
    segments && setMySegments(segments.filter(s => user && s.createdBy === user.email));
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

  const searchVideos = term => {
    services.youtube
      .get('/search', {
        params: {
          q: term,
        },
      })
      .then(response => {
        const mbtVids = response.data.items.filter(
          v => v.snippet.channelId === 'UCYwlraEwuFB4ZqASowjoM0g'
        );
        setVideos(mbtVids);
      });
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

            {user && (
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
                        <Grid.Row key={segment.id}>
                          <Grid.Column verticalAlign="middle" width={3}>
                            <Link to={`/watch/${segment.videoId}/${segment.id}`}>
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
                                utils.history.push(`/edit/${segment.videoId}/${segment.id}`)
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
                                utils.history.push(`/watch/${segment.videoId}/${segment.id}`)
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
                    <Grid.Row key={segment.id}>
                      <Grid.Column verticalAlign="middle" width={3}>
                        <Link to={`/watch/${segment.videoId}/${segment.id}`}>{segment.title}</Link>
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
                            utils.history.push(`/watch/${segment.videoId}/${segment.id}`)
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
