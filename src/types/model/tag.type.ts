/**
 * The following models might not match the model schemas defined in the backend,
 * but rather the structure of the data returned by the backend (sometimes formatted
 * for optimal use in the frontend).
 */
import { Segment } from 'types';

export type Tag = {
  _id?: string;
  name: string;
  segments?: Segment[] | TagSegment[];
};

export type TagSegment = {
  segment: Segment;
};
