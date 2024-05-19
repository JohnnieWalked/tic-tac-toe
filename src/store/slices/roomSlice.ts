import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

type RoomSliceProps = {
  roomname: string;
};

const initialState: RoomSliceProps = {
  roomname: '',
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoomName(state, action: PayloadAction<string>) {
      state.roomname = action.payload;
    },
  },
});

export const roomSliceActions = roomSlice.actions;
