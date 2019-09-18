// @flow

import * as store from '../store';
import axios from 'axios';
import { RESPONSE_MESSAGES } from '../config';

export type HttpClient = {|
  get: (url: string, params: {}, options?: {}) => Promise<any>,
  put: (url: string, payload: {}, options?: {}) => Promise<any>,
  post: (url: string, payload: {}, options?: {}) => Promise<any>,
  delete: (url: string, payload?: {}, options?: {}) => Promise<any>,
|};

const httpClient: HttpClient = {
  get: function(url: string, params: {}, options?: {}) {
    let config = {
      method: 'GET',
      url: url,
      params: params,
    };
    config = Object.assign(config, options);
    return axios(config)
      .then(function(response) {
        if (response.headers['x-access-token']) {
          updateTokens(response.headers);
        }
        return response;
      })
      .catch(function(error) {
        if (error === RESPONSE_MESSAGES.EXPIRED_ACCESS_TOKEN) {
          store.auth.useRefreshToken();
          return httpClient.get(url, params, options);
        } else {
          store.auth.clearAuth();
          throw error;
        }
      });
  },

  put: function(url: string, payload: {}, options?: {}) {
    let config = {
      method: 'PUT',
      url: url,
      data: payload,
    };
    config = Object.assign(config, options);
    return axios(config)
      .then(function(response) {
        if (response.headers['x-access-token']) {
          updateTokens(response.headers);
        }
        return response;
      })
      .catch(function(error) {
        if (error === RESPONSE_MESSAGES.EXPIRED_ACCESS_TOKEN) {
          store.auth.useRefreshToken();
          return httpClient.put(url, payload, options);
        } else {
          store.auth.clearAuth();
          throw error;
        }
      });
  },

  post: function(url: string, payload: {}, options?: {}) {
    let config = {
      method: 'POST',
      url: url,
      data: payload,
    };
    config = Object.assign(config, options);
    return axios(config)
      .then(function(response) {
        if (response.headers['x-access-token']) {
          updateTokens(response.headers);
        }
        return response;
      })
      .catch(function(error) {
        if (error === RESPONSE_MESSAGES.EXPIRED_ACCESS_TOKEN) {
          store.auth.useRefreshToken();
          return httpClient.post(url, payload, options);
        } else {
          store.auth.clearAuth();
          throw error;
        }
      });
  },

  delete: function(url: string, payload?: {}, options?: {}) {
    let config = {
      method: 'DELETE',
      url: url,
      data: payload,
    };
    config = Object.assign(config, options);
    return axios(config)
      .then(function(response) {
        if (response.headers['x-access-token']) {
          updateTokens(response.headers);
        }
        return response;
      })
      .catch(function(error) {
        if (error === RESPONSE_MESSAGES.EXPIRED_ACCESS_TOKEN) {
          store.auth.useRefreshToken();
          return httpClient.delete(url, payload, options);
        } else {
          store.auth.clearAuth();
          throw error;
        }
      });
  },
};

const updateTokens = (headers: { 'x-access-token': string, 'x-refresh-token': string }) => {
  const tokens = {
    accessToken: headers['x-access-token'],
    refreshToken: headers['x-refresh-token'],
  };
  store.auth.updateTokens(tokens);
};

export default httpClient;
