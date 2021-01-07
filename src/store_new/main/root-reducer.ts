import { combineReducers } from '@reduxjs/toolkit';
import { authStore, videoStore } from '../index';

export const rootReducer = combineReducers({
  auth: authStore.reducer,
  video: videoStore.reducer,
});
