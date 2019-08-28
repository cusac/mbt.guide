// @flow

import * as components from 'components';
import * as db from 'services/db';
import * as React from 'react';
import * as utils from 'utils';

const { Button, Grid, Segment } = components;

const VideoSegment = ({
  active,
  data: { start, end, title },
  color,
  onSelect,
  canEdit,
}: {
  active: boolean,
  data: db.VideoSegment,
  color: string,
  onSelect: () => void,
  canEdit: boolean,
}) => {
  return (
    <Segment color={color} onClick={() => onSelect()} className="video-segment">
      <Grid columns={2} divided>
        <Grid.Row>
          <Grid.Column verticalAlign="middle" width={3}>
            <Button active={active} circular icon={canEdit ? 'edit' : 'lock'} />
          </Grid.Column>
          <Grid.Column width={13} style={{ color: 'black' }}>
            {utils.timeFormat.to(start)} -> {utils.timeFormat.to(end)}
            <br />
            {title}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

VideoSegment.defaultProps = {
  active: false,
  onSelect: () => {},
};

export default VideoSegment;
