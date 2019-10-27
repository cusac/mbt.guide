// @flow

import * as store from '../store';

import { httpClient as http, firebaseAuth } from '../services';

const internals = {};

internals.login = ({
  idToken,
  email,
  password,
  displayName,
}: {
  idToken?: string,
  email?: string,
  password?: string,
  displayName?: string,
}) => {
  return http
    .post('/login', { idToken, email, password, displayName })
    .then(response => {
      console.log('LOGIN:', response);
      return store.auth.setAuth(response.data);
    })
    .catch(error => {
      console.error('authService.login-error:\n', error);
      throw error;
    });
};

internals.logout = () => {
  store.auth.useRefreshToken();
  return http
    .delete('/logout')
    .then(response => {
      firebaseAuth.signOut();
      store.auth.clearAuth();
    })
    .catch(error => {
      console.error('authService.logout-error:\n', error);
      throw error;
    });
};

export default internals;
