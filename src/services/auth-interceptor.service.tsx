import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';
import { RESPONSE_MESSAGES } from '../config';
import { StoreBundle } from 'store';

const internals = {} as any;

let store: StoreBundle;
export const initAuthInterceptorService = (storeBundle: StoreBundle): void => {
  store = storeBundle;
};

internals.responseError = function(err: any) {
  let response: any = err.response;

  if (!response) {
    console.error('NO RESPONSE IN ERROR');
    throw err;
  }

  if (response.status === 401 && response.data.message === RESPONSE_MESSAGES.EXPIRED_ACCESS_TOKEN) {
    // If the access token was expired, allow the httpClient service to try a refresh token
    console.debug('authInterceptor.service: 401: response:', response);

    response = RESPONSE_MESSAGES.EXPIRED_ACCESS_TOKEN;
  } else if (response.status === 401) {
    // If the token was invalid or the Refresh Token was expired, force user to login
    console.debug('authInterceptor.service: 401: response:', response);

    store.storeDispatch(store.clearAuth());

    Sentry.withScope(function(scope) {
      scope.setTag('status', response.status);
      response.config && scope.setTag('url', response.config.url);
      response.data && scope.setTag('serverError', response.data.error);
      response.config && scope.setExtra('request_payload', response.config.data);
      scope.setLevel(Sentry.Severity.Warning);
      response.data && Sentry.captureMessage(response.data.message);
    });

    (toast as any).warning('Your session has expired. Please sign in to continue');
  } else if (response.status === 403) {
    // The user is unauthorized
    console.debug('authInterceptor.service: 403: response:', response);
    Sentry.withScope(function(scope) {
      scope.setTag('status', response.status);
      response.config && scope.setTag('url', response.config.url);
      response.data && scope.setTag('serverError', response.data.error);
      response.config && scope.setExtra('request_payload', response.config.data);
      scope.setLevel(Sentry.Severity.Warning);
      response.data && Sentry.captureMessage(response.data.message);
    });

    (toast as any).warning('Not authorized: ' + response.data.message);
  } else {
    // If not a 401 or 403, do nothing with this error. This is necessary to make a `responseError`
    // interceptor a no-op. */
    Sentry.withScope(function(scope) {
      scope.setTag('status', response.status);
      response.config && scope.setTag('url', response.config.url);
      response.data && scope.setTag('serverError', response.data.error);
      response.config && scope.setExtra('request_payload', response.config.data);
      scope.setLevel(Sentry.Severity.Error);
      response.data && Sentry.captureMessage(response.data.message);
    });
  }

  return Promise.reject(response);
};

export default {
  responseError: internals.responseError,
};
