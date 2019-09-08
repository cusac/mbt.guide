// @flow

import React from 'reactn';
import * as data from 'data';

/**
 * Returns stored data about the video
 */
export default function useVideoData(id: string) {
  const [error, setError] = React.useState();
  const [video, setVideo] = React.useState((null: ?data.Video));
  React.useEffect(() => data.Video.subscribe(id, setVideo, setError), [id]);
  if (error) {
    throw error;
  }
  return video;
}
