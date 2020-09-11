import * as components from 'components';
import * as errors from 'errors';
import React from 'reactn';
import Editor from './Editor';

const { Button, Icon } = components;

const Edit = ({ videoId, segmentId }: { videoId: string; segmentId: string }) => (
  <Editor {...{ videoId, segmentId }} />
);

export default Edit;
