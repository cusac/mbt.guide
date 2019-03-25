// @flow

import { db } from '..';

export type Video = {|
  id: string,
  segments: Array<{|
    title: string,
    end: number, // seconds, last segment's end is the video duration
  |}>,
|};

export default db.collection('videos');
