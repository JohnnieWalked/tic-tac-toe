import { configureStore } from '@reduxjs/toolkit';
import { roomSlice } from './slices/roomSlice';
import { userSlice } from './slices/userSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      roomSlice: roomSlice.reducer,
      userSlice: userSlice.reducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
