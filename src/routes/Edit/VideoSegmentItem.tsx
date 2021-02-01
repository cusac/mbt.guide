import React from 'react';
import * as components from 'components';
import { Segment } from 'types';
import * as utils from 'utils';

const { Button, Grid, SegmentUI } = components;

const VideoSegmentItem = ({
  active,
  data: { start, end, title, video, segmentId },
  color,
  onSelect,
  canEdit,
}: {
  active: boolean;
  data: Segment;
  color: any;
  onSelect: () => void;
  canEdit: boolean;
}) => {
  const goTo = (event: any, path: any) => {
    event.stopPropagation();
    utils.history.push(path);
  };

  return (
    <SegmentUI color={color} onClick={() => onSelect()} className="video-segment">
      <Grid columns={2} divided>
        <Grid.Row>
          <Grid.Column verticalAlign="middle" width={3} style={{ padding: 0 }}>
            <Button
              active={active}
              style={{ margin: 0 }}
              circular
              icon={canEdit ? 'edit' : 'lock'}
              color={active ? 'green' : 'grey'}
            />
          </Grid.Column>
          <Grid.Column width={10} style={{ color: 'black' }}>
            {utils.timeFormat.to(start)} -{'>'} {utils.timeFormat.to(end)}
            <br />
            {title}
          </Grid.Column>
          <Grid.Column verticalAlign="middle" width={3} style={{ padding: 0 }}>
            <Button
              style={{ margin: 0 }}
              circular
              icon="play"
              onClick={event => goTo(event, `/segments/${segmentId}`)}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </SegmentUI>
  );
};

VideoSegmentItem.defaultProps = {
  active: false,
  onSelect: () => undefined,
};

export default VideoSegmentItem;
