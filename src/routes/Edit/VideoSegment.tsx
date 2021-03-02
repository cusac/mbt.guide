import * as components from '../../components';
import React from 'react';
import * as utils from '../../utils';

const { Button, Grid, SegmentUI } = components;

const VideoSegment = ({
  active,
  data: { start, end, title, videoId, id },
  color,
  onSelect,
  canEdit,
}: {
  active: boolean;
  data: any;
  color: string;
  onSelect: () => void;
  canEdit: boolean;
}) => {
  const goTo = (event: any, path: any) => {
    event.stopPropagation();
    utils.history.push(path);
  };

  return (
    <SegmentUI color={color as any} onClick={() => onSelect()} className="video-segment">
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
            {utils.timeFormat.to(start)} -{'>'} {utils.timeFormat.to(end)}
            <br />
            {title}
          </Grid.Column>
          <Grid.Column verticalAlign="middle" width={3} style={{ padding: 0 }}>
            <Button
              style={{ margin: 0 }}
              circular
              icon="play"
              onClick={event => goTo(event, `/segments/${id}`)}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </SegmentUI>
  );
};

VideoSegment.defaultProps = {
  active: false,
  onSelect: () => undefined,
};

export default VideoSegment;
