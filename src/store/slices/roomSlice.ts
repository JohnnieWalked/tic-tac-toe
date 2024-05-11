import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { Room } from '@/components/lobby-table/columns';

type RoomSliceProps = {
  allRooms: Room[];
  roomname: string;
  password: string;
};

const initialState: RoomSliceProps = {
  allRooms: [],
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
    updateAllRoomsData(state, action: PayloadAction<Room>) {},
  },
});

export const roomSliceActions = roomSlice.actions;
