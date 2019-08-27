// @flow

import * as components from 'components';
import * as data from 'data';
import * as db from 'services/db';
import * as React from 'react';
import * as services from 'services';
import * as errors from 'errors';

import Auth from './Auth';

import logo from './logo-wide.png';

const { Button, Link, Grid, Searchbar, VideoList, List } = components;

const Home = () => {
  const [error, setError] = React.useState();
  const [segments, setSegments] = React.useState((undefined: Array<db.VideoSegment> | void));
  const [mySegments, setMySegments] = React.useState((undefined: Array<db.VideoSegment> | void));
  const [selectedVideo, setSelectedVideo] = React.useState();
  const [videos, setVideos] = React.useState([]);
  const [segmentVideo, setSegmentVideo] = React.useState();

  React.useEffect(() => {
    services.youtube
      .get('/search', {
        params: {
          q: 'fire nov',
        },
      })
      .then(response => setVideos(response.data.items));
  }, []);

  React.useEffect(() => {
    error instanceof errors.MissingVideoError && segments && segments.length > 0 && setSegments([]);
  }, [error]);

  React.useEffect(() => {
    selectedVideo && data.Video.subscribe(selectedVideo.id.videoId, setSegmentVideo, setError);
  }, [selectedVideo]);

  React.useEffect(() => {
    setSegments(segmentVideo ? segmentVideo.segments : []);
  }, [segmentVideo]);

  React.useEffect(() => {
    segments && setMySegments(segments.filter(s => s.createdBy === user.email));
  }, [segments]);

  if (!videos) {
    return <div>Loading videos...</div>;
  }

  const videoSrc = selectedVideo ? `https://www.youtube.com/embed/${selectedVideo.id.videoId}` : '';

  const user = services.auth.currentUser;

  const searchVideos = term => {
    services.youtube
      .get('/search', {
        params: {
          q: term,
        },
      })
      .then(response => setVideos(response.data.items));
  };

  const selectVideo = video => {
    setSelectedVideo(video);
  };

  return (
    <div>
      <Grid>
        {/* Header */}
        <Grid.Row>
          <Grid.Column style={{ color: 'white ' }} verticalAlign="middle" width={4}>
            <img src={logo} alt="My Big TOE guide" />
          </Grid.Column>

          <Grid.Column style={{ color: 'white ' }} verticalAlign="middle" width={8}>
            <Searchbar onHandleSubmit={searchVideos} />
          </Grid.Column>

          <Grid.Column verticalAlign="middle" width={4}>
            {user ? (
              <div>
                {user.email}
                <br />
                <Button onClick={() => services.auth.signOut()} style={{ margin: 5 }}>
                  Sign out
                </Button>
              </div>
            ) : (
              <Auth />
            )}
          </Grid.Column>
        </Grid.Row>

        {/* Main */}
        <Grid.Row>
          <Grid.Column style={{ marginLeft: 20 }} width={11}>
            {selectedVideo ? (
              <div>
                <div className="ui embed">
                  <iframe src={videoSrc} allowFullScreen title="Video player" />
                </div>
                <div className="ui segment">
                  <h4 className="ui header">{selectedVideo.snippet.title}</h4>
                  {/* <p>{video.snippet.description}</p> */}
                </div>
              </div>
            ) : (
              <div>Select a video</div>
            )}
            <br />

            {mySegments && mySegments.length && (
              <List divided>
                {mySegments.map(segment => (
                  <List.Item>
                    <List.Content floated="right">
                      <Link to={`/edit/${segment.videoId}/${segment.id}`}>
                        <Button>Edit</Button>
                      </Link>
                    </List.Content>
                    {/* <Image avatar src="/images/avatar/small/lena.png" /> */}
                    <List.Content verticalAlign="middle" floated="left">
                      <Link to={`/watch/${segment.videoId}/${segment.id}`}>{segment.title}</Link>
                    </List.Content>
                    <List.Content verticalAlign="middle" floated="left">
                      {segment.description}
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            )}
            {segments && segments.length > 0 ? (
              <List divided>
                {segments.map(segment => (
                  <List.Item>
                    {/* <Image avatar src="/images/avatar/small/lena.png" /> */}
                    <List.Content verticalAlign="middle" floated="left">
                      <Link to={`/watch/${segment.videoId}/${segment.id}`}>{segment.title}</Link>
                    </List.Content>
                    <List.Content verticalAlign="middle" floated="left">
                      {segment.description}
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            ) : (
              selectedVideo && <div> No segments for this video </div>
            )}
          </Grid.Column>
          <Grid.Column style={{ color: 'white ' }} verticalAlign="middle" width={4}>
            <VideoList videos={videos} handleVideoSelect={selectVideo} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default Home;
