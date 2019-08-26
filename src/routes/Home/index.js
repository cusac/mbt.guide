// @flow

import * as components from 'components';
import * as data from 'data';
import * as db from 'services/db';
import * as React from 'react';
import * as services from 'services';

import Auth from './Auth';

import logo from './logo-wide.png';

const { Button, Link, Grid, Searchbar, VideoList } = components;

const Home = () => {
  const [error, setError] = React.useState();
  const [segments, setSegments] = React.useState((undefined: Array<db.VideoSegment> | void));
  const [selectedVideo, setSelectedVideo] = React.useState();
  const [videos, setVideos] = React.useState([]);
  React.useEffect(() => {
    data.Video.getSegments().then(setSegments, setError);
  }, []);
  if (error) {
    throw error;
  }

  React.useEffect(() => {
    services.youtube
      .get('/search', {
        params: {
          q: '',
        },
      })
      .then(response => setVideos(response.data.items));
  }, []);

  // React.useEffect(() => {

  // }, selectedVideo)

  if (!segments) {
    return <div>Loading segments</div>;
  }

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
          <Grid.Column style={{ marginLeft: 20 }} verticalAlign="top" width={11}>
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
          </Grid.Column>
          <Grid.Column style={{ color: 'white ' }} verticalAlign="middle" width={4}>
            <VideoList videos={videos} handleVideoSelect={setSelectedVideo} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          {segments.map(segment => (
            <div key={segment.id} style={{ marginBottom: 5, marginLeft: 20 }}>
              <Link to={`/watch/${segment.videoId}/${segment.id}`}>{segment.title}</Link>
            </div>
          ))}
          <hr />
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default Home;
