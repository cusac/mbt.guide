// @flow

import * as components from 'components';
import * as db from 'services/db';
import React from 'reactn';
import * as utils from 'utils';
import type { VideoSegment } from 'types';

const { Button, Grid, Segment } = components;

const VideoSegmentItem = ({
  active,
  data: { start, end, title, videoId, segmentId },
  color,
  onSelect,
  canEdit,
}: {
  active: boolean,
  data: VideoSegment,
  color: string,
  onSelect: () => void,
  canEdit: boolean,
}) => {
  const goTo = (event, path) => {
    event.stopPropagation();
    utils.history.push(path);
  };

  return (
    <Segment color={color} onClick={() => onSelect()} className="video-segment">
      <Grid columns={2} divided>
        <Grid.Row>
          <Grid.Column verticalAlign="middle" width={3} style={{ padding: 0 }}>
            <Button
              active={active}
              style={{ margin: 0 }}
              circular
              icon={canEdit ? 'edit' : 'lock'}
            />
          </Grid.Column>
          <Grid.Column width={10} style={{ color: 'black' }}>
            {utils.timeFormat.to(start)} -> {utils.timeFormat.to(end)}
            <br />
            {title}
          </Grid.Column>
          <Grid.Column verticalAlign="middle" width={3} style={{ padding: 0 }}>
            <Button
              style={{ margin: 0 }}
              circular
              icon="play"
              onClick={event => goTo(event, `/watch/${videoId}/${segmentId}`)}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

VideoSegmentItem.defaultProps = {
  active: false,
  onSelect: () => {},
};

export default VideoSegmentItem;
