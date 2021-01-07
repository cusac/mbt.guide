/**
 * The following models might not match the model schemas defined in the backend,
 * but rather the structure of the data returned by the backend (sometimes formatted
 * for optimal use in the frontend).
 */

import { Tag, User, Video } from '../index';

export type Segment = {
  _id?: string;
  tags?: Tag[] | SegmentTag[];
  video: Video | Video['_id'];
  owner: User | User['_id'];
  ownerEmail: string;
  segmentId: string;
  title: string;
  start: number;
  end: number; // seconds; last segment's end is the video duration
  description: string;
  pristine: boolean; // used to indicate the segment has changes that need saving
};
export function isSegment(obj: any): obj is Segment {
  return (
    obj !== undefined &&
    (obj as Segment).segmentId !== undefined &&
    (obj as Segment).video !== undefined &&
    (obj as Segment).owner !== undefined
  );
}

export type SegmentTag = {
  tag: Tag;
  rank: number;
};
export function isSegmentTag(obj: any): obj is SegmentTag {
  return (
    obj !== undefined &&
    (obj as SegmentTag).tag !== undefined &&
    (obj as SegmentTag).rank !== undefined
  );
}
