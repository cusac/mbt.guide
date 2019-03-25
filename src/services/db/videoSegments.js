// @flow

import { db } from '..';

export type VideoSegment = {|
  videoId: string,
  index: number, // starts with 0
  title: string,
  start: number,
  end: number, // seconds, last segment's end is the video duration
|};

export default db.collection('videoSegments');
