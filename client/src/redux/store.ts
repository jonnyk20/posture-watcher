import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";

import watcherReducer from "./watcherSlice";

export const store = configureStore({
  reducer: {
    watcher: watcherReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
