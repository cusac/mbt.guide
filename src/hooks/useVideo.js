// @flow

import * as React from 'react';
import * as data from 'data';

/**
 * Returns stored data about the video
 */
export default function useVideoData(id: string) {
  console.log('USE VIDEO:', id);
  const [error, setError] = React.useState();
  const [video, setVideo] = React.useState((null: ?data.Video));
  React.useEffect(() => data.Video.subscribe(id, setVideo, setError), [id]);
  if (error) {
    console.log('WHAAAT');
    throw error;
  }
  return video;
}
