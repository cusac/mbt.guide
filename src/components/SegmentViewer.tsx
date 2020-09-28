import * as components from '../components';
import React, { useGlobal } from 'reactn';
import * as utils from '../utils';
import { Grid, Link, Label, Button, Container, List, Icon } from '../components';

const SegmentViewer = ({ segment }: { segment: any }) => {
  const [currentUser] = (useGlobal as any)('user');
  const [currentUserScope] = (useGlobal as any)('scope');
  const [lastViewedSegmentId, setLastViewedSegmentId] = (useGlobal as any)('lastViewedSegmentId');

  React.useEffect(() => {
    segment &&
      segment.segmentId !== lastViewedSegmentId &&
      setLastViewedSegmentId(segment.segmentId);
  }, []);

  const canEdit =
    segment && currentUser
      ? currentUser.email === (segment as any).ownerEmail ||
        utils.hasPermission({ currentScope: currentUserScope, requiredScope: ['Admin'] })
      : false;

  const { start, end } = segment as any;
  return (
    <div>
      <h1>{(segment as any).title}</h1>
      <components.YouTubePlayerWithControls
        {...{ videoId: (segment as any).videoYtId, start, end }}
        autoplay
        duration={(segment as any).videoDuration}
        end={(segment as any).end}
        start={(segment as any).start}
        offsetTooltip={true}
      />
      {canEdit && (
        <Button style={{ margin: 15, marginTop: 50 }}>
          <Icon name="edit" />
          <Link to={`/edit/${(segment as any).videoYtId}/${segment.segmentId}`}>Edit segment</Link>
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
                    <Link to={`/${(segment as any).videoYtId}`}>{(segment as any).videoTitle}</Link>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    {utils.timeFormat.to((segment as any).start)} -{' '}
                    {utils.timeFormat.to((segment as any).end)}
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
              {(segment as any).description || 'No description available.'}
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column verticalAlign="middle" width={3}>
              <Label>Segment Length:</Label>
            </Grid.Column>
            <Grid.Column textAlign="left" width={13}>
              {utils.timeFormat.to((segment as any).end - (segment as any).start)}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column verticalAlign="middle" width={3}>
              <Label>Tags:</Label>
            </Grid.Column>
            <Grid.Column textAlign="left" width={13}>
              <List horizontal bulleted>
                {(segment as any).tags.map((tag: any) => (
                  <List.Item key={tag.tag._id}>
                    <List.Content>
                      <List.Header>{tag.tag.name}</List.Header>
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

export default SegmentViewer;
