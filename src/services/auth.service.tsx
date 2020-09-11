import * as store from '../store';
import { captureAndLog } from 'utils';import { httpClient as http, firebaseAuth } from '../services';

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
      return store.auth.setAuth(response.data);
    })
    .catch(err => {
      captureAndLog('authService', 'login', err);
      throw err;
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
    .catch(err => {
      captureAndLog('authService', 'logout', err);
      throw err;
    });
};

export default internals;
