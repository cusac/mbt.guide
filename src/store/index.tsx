import { setGlobal, addCallback } from 'reactn';
import auth, { useAuth, initalAuthState } from './auth.store';
import { authInterceptor } from '../services';
import axios from 'axios';
import * as Sentry from '@sentry/browser';

const useStore = () => {
  useAuth();

  // Every time the global state changes, this function will execute.
  addCallback(global => {
    console.log('NEW GLOBAL:', global);
    localStorage.setItem('globalState', JSON.stringify(global));

    // If the global state is anything other than 1, don't change it.
    return null;
  });
};

const initGlobalState = JSON.parse(localStorage.getItem('globalState') || '{}');

const initState = () => {
  console.log('INIT GLOBAL STATE:', initGlobalState);
  // Initialize auth header
  if (initGlobalState.accessToken) {
    axios.defaults.headers.common.Authorization = 'Bearer ' + initGlobalState.accessToken;
  }

  if (initGlobalState.user) {
    const { user } = initGlobalState;
    Sentry.configureScope(scope => {
      scope.setUser({
        id: user._id,
        username: `${user.firstName} ${user.lastName}`,
        email: user.email,
      });
    });
  }

  // Add a response interceptor
  axios.interceptors.response.use(function(response) {
    return Promise.resolve(response);
  }, authInterceptor.responseError);

  setGlobal({ ...initalAuthState, ...initGlobalState });
};

export { useStore, initState, auth };
