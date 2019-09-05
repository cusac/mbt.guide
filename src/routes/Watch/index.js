// @flow

import * as components from 'components';
import * as hooks from 'hooks';
import * as React from 'react';
import * as services from 'services';

import { Link } from 'components';

const Watch = ({ videoId, segmentId }: { videoId: string, segmentId: string }) => {
  const video = hooks.useVideo(videoId);
  if (!video) {
    return <div>Loading video data</div>;
  }

  const segment = video.segments.find(s => s.id === segmentId);
  if (!segment) {
    return <div>Missing segment</div>;
  }

  const user = services.auth.currentUser;

  const { start, end } = segment;
  return (
    <div>
      <h1 style={{ color: 'white' }}>{segment.title}</h1>
      <components.YouTubePlayerWithControls
        {...{ videoId, start, end }}
        autoplay
        duration={video.data.duration}
        end={segment.end}
        start={segment.start}
      />
      {user && (
        <div style={{ marginTop: 15 }}>
          <Link to={`/edit/${videoId}/${segmentId}`}>Edit segment</Link>
        </div>
      )}
    </div>
  );
};

export default Watch;
