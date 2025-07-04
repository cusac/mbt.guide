import { combineReducers } from '@reduxjs/toolkit';
import { authStore } from '../auth/auth.store';
import { videoStore } from '../video/video.store';
import { mainStore } from './main.store';

export const rootReducer = combineReducers({
  main: mainStore.reducer,
  auth: authStore.reducer,
  video: videoStore.reducer,
});
