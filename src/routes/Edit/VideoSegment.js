// @flow

import * as React from 'react';
import { Segment, Grid, Input } from 'semantic-ui-react';
import * as timeFormat from 'utils/timeFormat';
import * as db from 'services/db';

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
          {timeFormat.to(start)} -> {timeFormat.to(end)}
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
