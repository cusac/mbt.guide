import { combineReducers } from '@reduxjs/toolkit';
import { authStore } from '../index';

export const rootReducer = combineReducers({
  auth: authStore.reducer,
});
