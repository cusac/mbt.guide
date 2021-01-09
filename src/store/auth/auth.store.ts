import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/browser';
import axios, { AxiosResponse } from 'axios';
import { firebaseAuth } from 'services';
import { AsyncAppThunk } from 'store';
import { loginCall, logoutCall } from '../../services/auth.service';
import { AxiosErrorData, User, verifyModelType } from '../../types';
import captureAndLog from '../../utils/captureAndLog';
import { AppThunk } from '../index';
import { parseError } from '../utils';

//#region Types

export type AuthStoreAction = 'login' | 'logout';

export interface LoginResponse {
  user: User | undefined;
  scope: string[];
  accessToken: string;
  refreshToken: string;
}

export type AuthState = LoginResponse & {
  errors: Record<AuthStoreAction, Error | AxiosErrorData | undefined>;
};

//#endregion

//#region Reducers
/**
 * Reducers should only contain logic to update state. All other store logic should be moved to the actions/thunks.
 */

const initalAuthState: AuthState = {
  errors: {} as any,
  user: undefined,
  scope: [],
  accessToken: '',
  refreshToken: '',
};

export const authStore = createSlice({
  name: 'auth',
  initialState: initalAuthState,
  reducers: {
    setAccessToken(state, { payload }: PayloadAction<{ accessToken: string }>) {
      const { accessToken } = payload;
      state.accessToken = accessToken;
    },
    setRefreshToken(state, { payload }: PayloadAction<{ refreshToken: string }>) {
      const { refreshToken } = payload;
      state.refreshToken = refreshToken;
    },
    setAuth(state, { payload }: PayloadAction<{ response: LoginResponse }>) {
      const {
        response: { user, scope, accessToken, refreshToken },
      } = payload;
      state.user = user;
      state.scope = scope;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },
    clearAuth(state) {
      const { user, scope, accessToken, refreshToken } = initalAuthState;
      state.user = user;
      state.scope = scope;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },
    setError(
      state,
      { payload }: PayloadAction<{ action: AuthStoreAction; err: Error | AxiosErrorData }>
    ) {
      const { action, err } = payload;
      state.errors[action] = err;
    },
    clearError(state, { payload }: PayloadAction<{ action: AuthStoreAction }>) {
      const { action } = payload;
      state.errors[action] = undefined;
    },
  },
});

export const { setAccessToken, setRefreshToken, setAuth, clearAuth } = authStore.actions;
const { setError, clearError } = authStore.actions;

//#region Async Actions (Thunks)
/**
 * These actions contain the main logic to process and fetch state.
 *
 * Most async actions will be split into three parts: the call action, a success action, and a failure action.
 */

//#region login
export const login = ({
  idToken,
  email,
  password,
  displayName,
}: {
  idToken?: string;
  email?: string;
  password?: string;
  displayName?: string;
}): AsyncAppThunk => async (dispatch, getState) => {
  let response;
  try {
    const { data } = await loginCall({ idToken, email, password, displayName });
    response = data;
  } catch (err) {
    dispatch(loginFailure(err));
  }
  if (response !== undefined) {
    dispatch(loginSuccess(response));
  }
};

export const loginSuccess = (response: LoginResponse): AsyncAppThunk => async (
  dispatch,
  getState
) => {
  dispatch(setAuth({ response }));
  dispatch(clearError({ action: 'login' }));

  const { user, accessToken } = response;

  updateAuthHeader(accessToken);

  if (verifyModelType<User>(user, 'User')) {
    Sentry.configureScope(scope => {
      scope.setUser({
        id: user._id,
        username: `${user.firstName} ${user.lastName}`,
        email: user.email,
      });
    });
  }
};

export const loginFailure = (err: Error | AxiosResponse): AsyncAppThunk => async (
  dispatch,
  getState
) => {
  captureAndLog({ file: 'authStore', method: 'login', err });
  dispatch(setError({ action: 'login', err: parseError(err) }));
};
//#endregion

//#region logout
export const logout = (): AsyncAppThunk => async (dispatch, getState) => {
  try {
    dispatch(useRefreshToken());
    await logoutCall();
  } catch (err) {
    dispatch(logoutFailure(err));
  }
  dispatch(logoutSuccess());
};

export const logoutSuccess = (): AsyncAppThunk => async (dispatch, getState) => {
  dispatch(clearAuth());
  dispatch(clearError({ action: 'logout' }));

  firebaseAuth.signOut();

  axios.defaults.headers.common.Authorization = undefined;

  Sentry.configureScope(scope => {
    scope.setUser(null);
  });
};

export const logoutFailure = (err: Error): AsyncAppThunk => async (dispatch, getState) => {
  captureAndLog({ file: 'authStore', method: 'logout', err });
  dispatch(setError({ action: 'logout', err: parseError(err) }));
};
//#endregion

//#endregion

//#region Synchronous Actions (Thunks)
/**
 * These actions contain only synchronous logic
 */

export const updateTokens = ({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}): AppThunk => (dispatch, getState) => {
  updateAuthHeader(accessToken);
  dispatch(setAccessToken({ accessToken }));
  dispatch(setRefreshToken({ refreshToken }));
};

export const useRefreshToken = (): AppThunk => async (dispatch, getState) => {
  const {
    auth: { refreshToken },
  } = getState();
  updateAuthHeader(refreshToken);
};

//#endregion

//#region Utilities

const updateAuthHeader = (token: string) => {
  axios.defaults.headers.common.Authorization = 'Bearer ' + token;
};

//#endregion
