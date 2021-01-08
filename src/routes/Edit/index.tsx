import * as errors from '../../errors';
import React from 'react';
import Editor from './Editor';

const Edit = ({ videoId, segmentId }: { videoId: string; segmentId: string }) => (
  <Editor {...{ videoId, segmentId }} />
);

export default Edit;
