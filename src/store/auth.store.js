// @flow

import { useDispatch } from 'reactn';
import axios from 'axios';

const initalAuthState = {
  user: undefined,
  scope: [],
  accessToken: '',
  refreshToken: '',
};

const internals = {};

const initAuth = () => {
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
    return { ...state, user, scope, accessToken, refreshToken };
  });

  internals.clearAuth = useDispatch(state => {
    axios.defaults.headers.common.Authorization = undefined;

    console.debug('Clearing auth');
    return { ...state, ...initalAuthState };
  });
};

const updateAuthHeader = token => {
  axios.defaults.headers.common.Authorization = 'Bearer ' + token;
};

export { initalAuthState, initAuth };
export default internals;
