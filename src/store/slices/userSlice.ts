import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction, SerializedError } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { fetchUsername } from '../thunks/fetchUsername';
import { produce } from 'immer';

export type UserInfo = {
  username: string;
  userID: string;
  connected: boolean;
};

export type UserSliceStateType = {
  username: string;
  allUsersArray: UserInfo[];
  isInGame: 'in game' | 'not in game';
  isLoading: boolean;
  error: null | SerializedError;
};

const initialState: UserSliceStateType = {
  username: '',
  allUsersArray: [],
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
    updateAllUsersData(
      state,
      action: PayloadAction<Pick<UserSliceStateType, 'allUsersArray'>>
    ) {
      /* we used PRODUCE from IMMER to avoid mutation; logic => we check for existing user with same userID and set status; if user hasn't been found => just add new user;  */
      return produce(state, (draft) => {
        action.payload.allUsersArray.forEach((user) => {
          for (let i = 0; i < draft.allUsersArray.length; i++) {
            const existingUser = draft.allUsersArray[i];
            if (existingUser.userID === user.userID) {
              existingUser.connected = user.connected;
              return;
            }
          }
          draft.allUsersArray.push(user);
        });
      });
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
