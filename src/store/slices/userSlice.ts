import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction, SerializedError } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { fetchUsername } from '../thunks/fetchUsername';

type UserSliceStateType = {
  username: string;
  isInGame: 'in game' | 'not in game';
  isLoading: boolean;
  error: null | SerializedError;
};

const initialState: UserSliceStateType = {
  username: '',
  isInGame: 'not in game',
  isLoading: false,
  error: null,
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
  extraReducers(builder) {
    builder.addCase(fetchUsername.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUsername.fulfilled, (state, action) => {
      state.isLoading = false;
      state.username = action.payload;
    });
    builder.addCase(fetchUsername.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    });
  },
});

export const userSliceActions = userSlice.actions;
