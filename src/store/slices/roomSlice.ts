import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { produce } from 'immer';

import type { RootState } from '..';

/* types */
import type { IRoom, IRoomParticipator } from '@/types';

const initialState: IRoom = {
  roomname: '',
  participators: [],
  roles: {
    x: null,
    o: null,
  },
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoomName(state, action: PayloadAction<string>) {
      state.roomname = action.payload;
    },
    setRoomParticipators(state, action: PayloadAction<IRoomParticipator[]>) {
      state.participators = action.payload;
    },
    assignRoles(
      state,
      action: PayloadAction<{ x: string | null; o: string | null }>
    ) {
      state.roles = action.payload;
      // return produce(state, (draft) => {
      //   draft.participators.forEach((participator) => {
      //     for (const [keyRole, userID] of Object.entries(action.payload)) {
      //       if (participator.userID === userID) {
      //         participator.role = keyRole as 'x' | 'o';
      //         return;
      //       }
      //       participator.role = undefined;
      //     }
      //   });
      // });
    },
  },
});

export const roomSliceActions = roomSlice.actions;
