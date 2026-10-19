import { configureStore } from '@reduxjs/toolkit';
import { borrowLimitMiddleware } from '../features/books/borrowLimitMiddleware';
import { rootReducer } from './rootReducer';
import type { RootState } from './rootReducer';

export function createAppStore(preloadedState?: RootState) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(borrowLimitMiddleware),
  });
}

export const store = createAppStore();
export type AppStore = ReturnType<typeof createAppStore>;
export type AppDispatch = AppStore['dispatch'];
export type { RootState } from './rootReducer';
