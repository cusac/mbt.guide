import * as store from '../store';
import { captureAndLog } from '../utils';
import { httpClient as http, firebaseAuth } from '../services';

const internals = {} as any;

internals.login = ({
  idToken,
  email,
  password,
  displayName,
}: {
  idToken?: string;
  email?: string;
  password?: string;
  displayName?: string;
}) => {
  return http
    .post('/login', { idToken, email, password, displayName })
    .then(response => {
      return (store as any).auth.setAuth(response.data);
    })
    .catch(err => {
      captureAndLog('authService', 'login', err);
      throw err;
    });
};

internals.logout = () => {
  (store as any).auth.useRefreshToken();
  return http
    .delete('/logout')
    .then(response => {
      firebaseAuth.signOut();
      (store as any).auth.clearAuth();
    })
    .catch(err => {
      captureAndLog('authService', 'logout', err);
      throw err;
    });
};

export default internals;
