// @flow

import { setGlobal, addCallback } from 'reactn';
import auth, { initAuth, initalAuthState } from './auth.store';

const init = () => {
  // Every time the global state changes, this function will execute.
  addCallback(global => {
    console.log('NEW GLOBAL:', global);

    // If the global state is anything other than 1, don't change it.
    return null;
  });
  initAuth();
};

const initState = () => {
  setGlobal({ ...initalAuthState });
};

export { init, initState, auth };
