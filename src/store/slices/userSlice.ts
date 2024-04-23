import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

type UserSliceStateType = {
  username: string;
  isInGame: 'in game' | 'not in game';
};

const initialState: UserSliceStateType = {
  username: '',
  isInGame: 'not in game',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    updateIsInGameStatus(
      state,
      action: PayloadAction<'in game' | 'not in game'>
    ) {
      state.isInGame = action.payload;
    },
  },
});

export const userSliceActions = userSlice.actions;
