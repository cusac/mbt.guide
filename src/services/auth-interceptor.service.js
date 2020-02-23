// @flow

import * as store from 'store';
import { toast } from 'react-toastify';

import { RESPONSE_MESSAGES } from '../config';

const internals = {};

internals.responseError = function(err: any) {
  let response = err.response;

  if (!response) {
    console.error('NO RESPONSE IN ERROR');
    throw err;
  }

  // var Notification = $injector.get('Notification');

  // If the access token was expired, allow the apiHelperService to try a refresh token
  if (response.status === 401 && response.data.message === RESPONSE_MESSAGES.EXPIRED_ACCESS_TOKEN) {
    console.debug('authInterceptor.service: 401: response:', response);

    response = RESPONSE_MESSAGES.EXPIRED_ACCESS_TOKEN;

    // If the token was invalid or the Refresh Token was expired, force user to login
  } else if (response.status === 401) {
    console.debug('authInterceptor.service: 401: response:', response);

    store.auth.clearAuth();
  } else if (response.status === 403) {
    // The user is unauthorized
    console.debug('authInterceptor.service: 403: response:', response);

    toast.warning('Not authorized: ' + response.data.message);
  }
  // If not a 401 or 403, do nothing with this error. This is necessary to make a `responseError`
  // interceptor a no-op. */
  return Promise.reject(response);
};

export default {
  responseError: internals.responseError,
};
