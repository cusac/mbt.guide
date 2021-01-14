import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosErrorData } from '../../types';

//#region Types

export type MainStoreAction = '';

export type MainState = {
  previousView: 'video' | 'segment';
  showSearchbar: boolean;
  errors: Record<MainStoreAction, Error | AxiosErrorData | undefined>;
};

//#endregion

//#region Reducers
/**
 * Reducers should only contain logic to update state. All other store logic should be moved to the actions/thunks.
 */

const initalVideoState: MainState = {
  errors: {} as any,
  previousView: 'video',
  showSearchbar: true,
};

export const mainStore = createSlice({
  name: 'main',
  initialState: initalVideoState,
  reducers: {
    setPreviousView(state, { payload }: PayloadAction<{ previousView: 'video' | 'segment' }>) {
      const { previousView } = payload;
      state.previousView = previousView;
    },
    setShowSearchbar(state, { payload }: PayloadAction<{ showSearchbar: boolean }>) {
      const { showSearchbar } = payload;
      state.showSearchbar = showSearchbar;
    },
    setError(
      state,
      { payload }: PayloadAction<{ action: MainStoreAction; err: Error | AxiosErrorData }>
    ) {
      const { action, err } = payload;
      state.errors[action] = err;
    },
    clearError(state, { payload }: PayloadAction<{ action: MainStoreAction }>) {
      const { action } = payload;
      state.errors[action] = undefined;
    },
  },
});

export const { setPreviousView, setShowSearchbar } = mainStore.actions;

//#region Async Actions (Thunks)
/**
 * These actions contain the main logic to process and fetch state.
 *
 * Most async actions will be split into three parts: the call action, a success action, and a failure action.
 */

//#region createVideo

//#endregion

//#region updateSegments

//#endregion

//#endregion

//#region Synchronous Actions (Thunks)
/**
 * These actions contain only synchronous logic
 */

//#endregion

//#region Utilities

//#endregion
