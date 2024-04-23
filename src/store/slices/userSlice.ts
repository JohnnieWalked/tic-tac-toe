import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

const initialState = {
  username: '',
  isInGame: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    updateIsInGameStatus(state, action: PayloadAction<boolean>) {
      state.isInGame = action.payload;
    },
  },
});

export const userSliceActions = userSlice.actions;
