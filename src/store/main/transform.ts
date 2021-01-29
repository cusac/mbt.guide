import { createTransform } from 'redux-persist';
import axios from 'axios';
import * as Sentry from '@sentry/browser';
import { setLastViewedSegmentId } from 'store';

/**
 * This function provides the opportunity to transform the persisted state before it is saved or before it is loaded. It also is used as an opportunity to act on any persisted state as it is loaded.
 */
const SetTransform = createTransform(
  // transform state on its way to being serialized and persisted.
  (inboundState: any, key) => {
    console.log('SAVING STATE:', inboundState);
    return inboundState;
  },
  // transform state being rehydrated
  (outboundState, key) => {
    // TODO: Version state data/check for changes in the shape of data loaded and avoid crashes.
    console.log('LOADING STATE:', key, outboundState);
    // Initialize auth header
    if (outboundState.accessToken) {
      axios.defaults.headers.common.Authorization = 'Bearer ' + outboundState.accessToken;
    }

    // Initialize sentry user
    if (outboundState.user) {
      const { user } = outboundState;
      Sentry.configureScope(scope => {
        scope.setUser({
          id: user._id,
          username: `${user.firstName} ${user.lastName}`,
          email: user.email,
        });
      });
    }

    // TODO: Find a better option than a default segmentId
    if (key === 'video' && !outboundState.lastViewedSegmentId) {
      outboundState.lastViewedSegmentId = '156b09ce-7dab-417a-8295-f6f86f1f504a';
    }
    return outboundState;
  }
);

export default SetTransform;
