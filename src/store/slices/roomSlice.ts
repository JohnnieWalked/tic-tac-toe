import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

type RoomSliceProps = {
  roomname: string;
  password: string;
};

const initialState: RoomSliceProps = {
  roomname: '',
  password: '',
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoomName(state, action: PayloadAction<string>) {
      state.roomname = action.payload;
    },
    setPassword(state, action: PayloadAction<string>) {
      state.password = action.payload;
    },
  },
});

export const roomSliceActions = roomSlice.actions;
