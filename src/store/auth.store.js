// @flow

import { useDispatch } from 'reactn';
import axios from 'axios';
import * as Sentry from '@sentry/browser';

const initalAuthState = {
  user: undefined,
  scope: [],
  accessToken: '',
  refreshToken: '',
};

const internals = {};

const useAuth = () => {
  internals.updateTokens = useDispatch((state, dispatch, { accessToken, refreshToken }) => {
    updateAuthHeader(accessToken);

    console.debug('Tokens updated');
    return { ...state, accessToken, refreshToken };
  });

  internals.useRefreshToken = useDispatch(state => {
    updateAuthHeader(state.refreshToken);

    console.debug('Using refresh token');
    return state;
  });

  internals.setAuth = useDispatch((state, dispatch, data) => {
    const { user, scope, accessToken, refreshToken } = data;
    updateAuthHeader(accessToken);

    Sentry.configureScope(scope => {
      scope.setUser({
        id: user._id,
        username: `${user.firstName} ${user.lastName}`,
        email: user.email,
      });
    });

    return { ...state, user, scope, accessToken, refreshToken };
  });

  internals.clearAuth = useDispatch(state => {
    axios.defaults.headers.common.Authorization = undefined;

    Sentry.configureScope(scope => {
      scope.setUser(null);
    });

    console.debug('Clearing auth');
    return { ...state, ...initalAuthState };
  });
};

const updateAuthHeader = token => {
  axios.defaults.headers.common.Authorization = 'Bearer ' + token;
};

export { initalAuthState, useAuth };
export default internals;
