// @flow

import { db } from '..';

export type VideoSegment = {|
  id: string,
  createdBy: string,
  videoId: string,
  title: string,
  start: number,
  end: number, // seconds, last segment's end is the video duration
  tags: string[],
  description: string,
|};

export default db.collection('videoSegments');
