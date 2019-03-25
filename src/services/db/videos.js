// @flow

import { db } from '..';

export type Video = {|
  id: string,
  duration: number, // video length in seconds
  segments: Array<{|
    title: string,
    end: number, // seconds, last segment's end is the video duration
  |}>,
  youtube: Object, // cached information about the video from YouTube
|};

export default db.collection('videos');
