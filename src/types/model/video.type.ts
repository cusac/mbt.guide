/**
 * The following models might not match the model schemas defined in the backend,
 * but rather the structure of the data returned by the backend (sometimes formatted
 * for optimal use in the frontend).
 */

import { Segment, YTVideo } from '../index';

export type Video = {
  _id?: string;
  segments?: Segment[] | VideoSegment[];
  ytId: string;
  duration: number; // video length in seconds
  youtube: YTVideo; // cached information about the video from YouTube
};
export function isVideo(obj: any): obj is Video {
  return (
    obj !== undefined &&
    (obj as Video).ytId !== undefined &&
    (obj as Video).duration !== undefined &&
    (obj as Video).youtube !== undefined
  );
}

export interface VideoSegment {
  segment: Segment;
}
export function isVideoSegment(obj: any): obj is VideoSegment {
  return obj !== undefined && (obj as VideoSegment).segment !== undefined;
}
