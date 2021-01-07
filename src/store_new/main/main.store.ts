/* eslint-disable @typescript-eslint/ban-ts-comment */
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { Action, AnyAction, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { monitorReducerEnhancer } from './enhancers';
import { loggerMiddleware } from './middleware';
import { rootReducer } from '../index';
import * as storeBundle from '../index';
import { initHttpClientService } from 'services/http-client.service';
import { initAuthInterceptorService } from '../../services/auth-interceptor.service';
import { useDispatch } from 'react-redux';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function configureAppStore(preloadedState?: any) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().prepend(
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

export const store_new = configureAppStore();

// Files that require the store need the store to be injected to avoid circular dependencies.
initHttpClientService(storeBundle);
initAuthInterceptorService(storeBundle);

export type RootState = ReturnType<typeof rootReducer>;

export type AsyncAppThunk<T = void> = ThunkAction<Promise<T>, RootState, unknown, Action<string>>;
export type AppThunk<T = void> = ThunkAction<T, RootState, unknown, Action<string>>;

export type AppDispatch = typeof store_new.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type GetState = typeof store_new.getState;
export type StoreBundle = typeof storeBundle;

export const storeDispatch: AppDispatch = (action: any) => store_new.dispatch(action as any);
export const storeGetState: GetState = () => store_new.getState();
