// @flow

import * as React from 'react';
import * as data from 'data';

/**
 * Returns stored data about the video
 */
export default function useVideoData(options: {| ytVideoId: string, fallback?: boolean |}) {
  const [video, setVideo] = React.useState((null: ?data.Video));
  const [error, setError] = React.useState();
  if (error) {
    throw error;
  }

  React.useEffect(() => data.Video.subscribe(options, setVideo, setError), [
    options.ytVideoId,
    options.fallback,
  ]);

  return video;
}
