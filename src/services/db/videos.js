// @flow

import { db } from '..';

export type Video = {|
  id: string,
  duration: number, // video length in seconds
  youtube: Object, // cached information about the video from YouTube
|};

export default db.collection('videos');
