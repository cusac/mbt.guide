// @flow

import { setGlobal, addCallback } from 'reactn';
import auth, { initAuth, initalAuthState } from './auth.store';

const init = () => {
  // Every time the global state changes, this function will execute.
  addCallback(global => {
    console.log('NEW GLOBAL:', global);
    localStorage.setItem('globalState', JSON.stringify(global));

    // If the global state is anything other than 1, don't change it.
    return null;
  });
  initAuth();
};

const initGlobalState = JSON.parse(localStorage.getItem('globalState') || '{}');

const initState = () => {
  console.log('INIT GLOBAL STATE:', initGlobalState);
  setGlobal({ ...initalAuthState, ...initGlobalState });
};

export { init, initState, auth };
