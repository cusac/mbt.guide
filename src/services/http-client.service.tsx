import * as store from '../store';
import axios from 'axios';
import { RESPONSE_MESSAGES } from '../config';

export type HttpClient = {
  get: (url: string, params?: any, options?: any) => Promise<any>;
  put: (url: string, payload?: any, options?: any) => Promise<any>;
  post: (url: string, payload?: any, options?: any) => Promise<any>;
  delete: (url: string, payload?: any, options?: any) => Promise<any>;
};

const httpClient: HttpClient = {
  get: function(url: string, params?: any, options?: any) {
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
          (store as any).auth.useRefreshToken();
          return httpClient.get(url, params, options);
        } else {
          throw error;
        }
      });
  },

  put: function(url: string, payload?: any, options?: any) {
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
          (store as any).auth.useRefreshToken();
          return httpClient.put(url, payload, options);
        } else {
          throw error;
        }
      });
  },

  post: function(url: string, payload?: any, options?: any) {
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
          (store as any).auth.useRefreshToken();
          return httpClient.post(url, payload, options);
        } else {
          throw error;
        }
      });
  },

  delete: function(url: string, payload?: any, options?: any) {
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
          (store as any).auth.useRefreshToken();
          return httpClient.delete(url, payload, options);
        } else {
          throw error;
        }
      });
  },
};

const updateTokens = (headers: { 'x-access-token': string; 'x-refresh-token': string }) => {
  const tokens = {
    accessToken: headers['x-access-token'],
    refreshToken: headers['x-refresh-token'],
  };
  (store as any).auth.updateTokens(tokens);
};

export default httpClient;
