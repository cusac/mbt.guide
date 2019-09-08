// @flow

import * as components from 'components';
import * as data from 'data';
import * as errors from 'errors';
import React from 'reactn';

import Editor from './Editor';

const { Button, Icon } = components;

const Edit = ({ videoId, segmentId }: { videoId: string, segmentId: string }) => (
  <components.ErrorBoundary
    onError={(error, done) =>
      error instanceof errors.MissingVideoError && (
        <div>
          You need to create a new video!
          <br />
          <br />
          <Button color="green" onClick={() => data.Video.create(videoId).then(done)}>
            <Icon name="add" /> Create a new video
          </Button>
        </div>
      )
    }
  >
    <Editor {...{ videoId, segmentId }} />
  </components.ErrorBoundary>
);

export default Edit;
