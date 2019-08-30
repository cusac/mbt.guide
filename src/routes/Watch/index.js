// @flow

import * as components from 'components';
import * as hooks from 'hooks';
import * as React from 'react';
import * as services from 'services';
import * as utils from 'utils';

import { Grid, Link, AppHeader, Label, Button, Container, Loading, List } from 'components';

const Watch = ({ videoId, segmentId }: { videoId: string, segmentId: string }) => {
  const video = hooks.useVideo(videoId);
  if (!video) {
    return (
      <div>
        <AppHeader showSearchbar={true} />
        <Loading>Loading video data...</Loading>
      </div>
    );
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
      <AppHeader currentVideoId={videoId} />
      <h1>{segment.title}</h1>
      <components.YouTubePlayerWithControls
        {...{ videoId, start, end }}
        autoplay
        duration={video.data.duration}
        end={segment.end}
        start={segment.start}
        offsetTooltip={true}
      />
      {user && user.email === segment.createdBy && (
        <Button style={{ margin: 15, marginTop: 50 }}>
          <Link to={`/edit/${videoId}/${segmentId}`}>Edit segment</Link>
        </Button>
      )}
      <br />
      <Container>
        <Grid relaxed celled="internally">
          <Grid.Row>
            <Grid.Column verticalAlign="middle" width={3}>
              <Label>From Video:</Label>
            </Grid.Column>
            <Grid.Column textAlign="left" width={13}>
              <List horizontal bulleted>
                <List.Item>
                  <List.Content>
                    <Link to={`/${videoId}`}>{video.data.youtube.snippet.title}</Link>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    {utils.timeFormat.to(segment.start)} - {utils.timeFormat.to(segment.end)}
                  </List.Content>
                </List.Item>
              </List>
            </Grid.Column>
          </Grid.Row>
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
              <Label>Segment Length:</Label>
            </Grid.Column>
            <Grid.Column textAlign="left" width={13}>
              {utils.timeFormat.to(segment.end - segment.start)}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column verticalAlign="middle" width={3}>
              <Label>Tags:</Label>
            </Grid.Column>
            <Grid.Column textAlign="left" width={13}>
              <List horizontal bulleted>
                {segment.tags.map(tag => (
                  <List.Item key={tag}>
                    <List.Content>
                      <List.Header>{tag}</List.Header>
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

export default Watch;
