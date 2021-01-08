/* eslint-disable @typescript-eslint/ban-ts-comment */
import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { ThunkAction } from 'redux-thunk';
import { authInterceptor } from 'services';
import { initHttpClientService } from 'services/http-client.service';
import { initAuthInterceptorService } from '../../services/auth-interceptor.service';
import * as storeBundle from '../index';
import { rootReducer } from '../index';
import { monitorReducerEnhancer } from './enhancers';
import { loggerMiddleware } from './middleware';
import SetTransform from './transform';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  transforms: [SetTransform],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function configureAppStore(preloadedState?: any) {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).prepend(
        // correctly typed middlewares can just be used
        loggerMiddleware
        // middleware: [loggerMiddleware, ...getDefaultMiddleware()],
      ),
    preloadedState,
    enhancers: [monitorReducerEnhancer as any],
  });

  //@ts-ignore
  if (process.env.NODE_ENV !== 'production' && module.hot) {
    //@ts-ignore
    module.hot.accept('./root-reducer', () => store.replaceReducer(rootReducer));
  }

  return store;
}

export const store = configureAppStore();

export const persistor = persistStore(store);

// Files that require the store need the store to be injected to avoid circular dependencies.
initHttpClientService(storeBundle);
initAuthInterceptorService(storeBundle);

export type RootState = ReturnType<typeof rootReducer>;

export type AsyncAppThunk<T = void> = ThunkAction<Promise<T>, RootState, unknown, Action<string>>;
export type AppThunk<T = void> = ThunkAction<T, RootState, unknown, Action<string>>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type GetState = typeof store.getState;
export type StoreBundle = typeof storeBundle;

export const storeDispatch: AppDispatch = (action: any) => store.dispatch(action as any);
export const storeGetState: GetState = () => store.getState();

/**
 * Any code that needs to be run before the app is rendered can be added here.
 */
export const initApp = () => {
  // Add a response interceptor
  axios.interceptors.response.use(function(response) {
    return Promise.resolve(response);
  }, authInterceptor.responseError);
};
