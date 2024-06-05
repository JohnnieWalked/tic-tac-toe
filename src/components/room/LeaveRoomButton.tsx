'use client';

import { socket, socketEvents } from '@/socket';

/* rtk */
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { roomSliceActions } from '@/store/slices/roomSlice';

/* components */
import PrimaryButton from '../common/PrimaryButton';
import { useEffect } from 'react';
import Link from 'next/link';

export default function LeaveRoomButton() {
  const dispatch = useAppDispatch();
  const { roomname } = useAppSelector((state) => state.roomSlice);

  /* leave room after leaving page */
  useEffect(() => {
    function leavePage() {
      if (!roomname) return;
      socket.emit(
        socketEvents.LEAVE_ROOM,
        { roomname },
        (response: { success: boolean }) => {
          if (response.success) {
            dispatch(roomSliceActions.setRoomName(''));
          }
        }
      );
    }

    window.addEventListener('popstate', leavePage);

    return () => {
      leavePage();
      window.removeEventListener('popstate', leavePage);
    };
  }, [dispatch, roomname]);

  return (
    <PrimaryButton
      asChild
      variant="destructive"
      className=" mt-10 md:col-span-2"
    >
      <Link href={'/new-game/'}>Leave game</Link>
    </PrimaryButton>
  );
}
