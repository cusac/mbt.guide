// @flow

import { Button, Icon } from 'semantic-ui-react';
import * as components from 'components';
import * as data from 'data';
import * as errors from 'errors';
import * as React from 'react';

import Editor from './Editor';

const Edit = ({ videoId, index }: { videoId: string, index: number }) => (
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
    <Editor {...{ videoId, index }} />
  </components.ErrorBoundary>
);

export default Edit;
