// @flow

import { Segment, Grid, Input } from 'semantic-ui-react';
import * as db from 'services/db';
import * as React from 'react';
import * as utils from 'utils';

const VideoSegment = ({
  data: { start, end, title },
  color,
  onChange,
}: {
  data: db.VideoSegment,
  color: string,
  onChange: ($Shape<db.VideoSegment>) => void,
}) => {
  return (
    <Segment color={color}>
      <Grid.Row>
        <Grid.Column>
          {utils.timeFormat.to(start)} -> {utils.timeFormat.to(end)}
        </Grid.Column>
      </Grid.Row>
      <Grid columns={2} divided>
        <Grid.Row>
          <Grid.Column verticalAlign="middle" width={3}>
            Title
          </Grid.Column>
          <Grid.Column width={13}>
            <Input
              fluid
              placeholder="Title"
              value={title}
              onChange={(event, { value }) => onChange({ title: value })}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

VideoSegment.defaultProps = {
  onChange: () => {},
};

export default VideoSegment;
