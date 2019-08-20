// @flow

import { db } from '..';

export type VideoSegment = {|
  id: string,
  videoId: string,
  title: string,
  start: number,
  end: number, // seconds, last segment's end is the video duration
|};

export default db.collection('videoSegments');
