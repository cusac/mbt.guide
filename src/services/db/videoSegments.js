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
  pristine: boolean, // used to indicate the segment has changes that need saving
|};

export default db.collection('videoSegments');
