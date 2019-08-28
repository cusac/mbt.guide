// @flow

import * as components from 'components';
import * as hooks from 'hooks';
import * as React from 'react';
import * as services from 'services';

import { Grid, Link, AppHeader, Label, Button, List, Container } from 'components';

const Watch = ({ videoId, segmentId }: { videoId: string, segmentId: string }) => {
  const video = hooks.useVideo(videoId);
  if (!video) {
    return <div>Loading video data</div>;
  }

  const segment = video.segments.find(s => s.id === segmentId);
  if (!segment) {
    return (
      <div>
        <AppHeader />
        <div>Missing segment</div>
      </div>
    );
  }

  const user = services.auth.currentUser;

  const { start, end } = segment;
  return (
    <div>
      <AppHeader />
      <h1>{segment.title}</h1>
      <components.YouTubePlayerWithControls
        {...{ videoId, start, end }}
        autoplay
        duration={video.data.duration}
        end={segment.end}
        start={segment.start}
      />
      {user && user.email === segment.createdBy && (
        <Button style={{ margin: 15 }}>
          <Link to={`/edit/${videoId}/${segmentId}`}>Edit segment</Link>
        </Button>
      )}
      <br />
      <Container>
        <Grid relaxed celled="internally">
          <Grid.Row>
            <Grid.Column verticalAlign="middle" width={3}>
              <Label>Description:</Label>
            </Grid.Column>
            <Grid.Column textAlign="left" width={13}>
              {segment.description || 'No description available.'}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column verticalAlign="middle" width={3}>
              <Label>Tags:</Label>
            </Grid.Column>
            <Grid.Column textAlign="left" width={13}>
              {segment.tags.join(', ')}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

export default Watch;
