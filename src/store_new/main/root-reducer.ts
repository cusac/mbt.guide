import { combineReducers } from '@reduxjs/toolkit';
import { authStore, videoStore, mainStore } from '../index';

export const rootReducer = combineReducers({
  main: mainStore.reducer,
  auth: authStore.reducer,
  video: videoStore.reducer,
});
