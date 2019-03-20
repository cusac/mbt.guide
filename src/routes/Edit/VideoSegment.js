// @flow

import * as React from 'react';
import { Segment, Grid, Input } from 'semantic-ui-react';

import * as timeFormat from 'utils/timeFormat';
import type { SegmentData } from './VideoSplitter';

const VideoSegment = ({
  index,
  color,
  start,
  data: { end, title },
  onChange,
}: {
  index: number,
  color: string,
  start: number,
  data: SegmentData,
  onChange: ($Shape<SegmentData>) => void,
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
