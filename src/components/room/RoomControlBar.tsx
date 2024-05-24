'use client';

import { useEffect, useState, startTransition } from 'react';
import { useToast } from '../ui/use-toast';

/* socket */
import { socket, socketEvents } from '@/socket';

/* rtk */
import { useAppSelector, useAppDispatch } from '@/hooks/hooks';
import { roomSliceActions } from '@/store/slices/roomSlice';

/* helpers */
import { joinRoom } from '@/helpers/joinRoom';

/* ui, components */
import { RxCross2, RxCircle } from 'react-icons/rx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Subheader from '../common/Subheader';
import { Button } from '../ui/button';
import PrimaryButton from '../common/PrimaryButton';

/* types */
import type { IResponseFromServer } from '@/types';

type RoomControlBarProps = {
  roomnameURLQuery: string;
  passwordURLQuery: string;
};

export default function RoomControlBar({
  roomnameURLQuery,
  passwordURLQuery,
}: RoomControlBarProps) {
  const dispatch = useAppDispatch();
  const { roomname, participators } = useAppSelector(
    (state) => state.roomSlice
  );
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);

  /* reconnect if user refreshed the page  */
  useEffect(() => {
    if (!roomname) {
      startTransition(async () => {
        const result = await joinRoom(roomnameURLQuery, passwordURLQuery);
        if (result.success) {
          dispatch(roomSliceActions.setRoomName(roomnameURLQuery));
          toast({
            title: 'Success!',
            description: result.description,
          });
        } else {
          toast({
            title: 'Error!',
            variant: 'destructive',
            description: result.description,
          });
        }
      });
    }
  }, [dispatch, passwordURLQuery, roomname, roomnameURLQuery, toast]);

  useEffect(() => {
    if (!roomname) return;

    /* set info about opponent */
    function roomParticipators(data: { username: string; userID: string }[]) {
      dispatch(roomSliceActions.setRoomParticipators(data));
    }

    function assignRolesToParticipators(data: {
      x: string | null;
      o: string | null;
    }) {
      dispatch(roomSliceActions.assignRoles(data));
    }

    socket.emit(socketEvents.USERS_IN_ROOM, { roomname });
    socket.on(socketEvents.USERS_IN_ROOM, roomParticipators);
    if (participators.length !== 0) {
      socket.emit(socketEvents.ROOM_ROLES, { roomname });
      socket.on(socketEvents.ROOM_ROLES, assignRolesToParticipators);
    }

    return () => {
      socket.off(socketEvents.USERS_IN_ROOM, roomParticipators);
      socket.off(socketEvents.ROOM_ROLES, assignRolesToParticipators);
    };
  }, [dispatch, participators.length, roomname]);

  const handleSubmit = (formData: FormData) => {
    const roleSelected = formData.get('role');

    socket.emit(
      socketEvents.ROLE_SELECTION,
      { selectedRole: roleSelected, roomname: roomnameURLQuery },
      (response: IResponseFromServer) => {
        if (response.success) {
          toast({
            title: 'Success!',
            description: response.description,
          });
        } else {
          toast({
            title: 'Error!',
            variant: 'destructive',
            description: response.description,
          });
        }
        setShowDialog(false);
      }
    );
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col items-center justify-center gap-3 text-base">
        <Subheader className=" text-base">
          Current mark:{' '}
          <span className=" font-light italic">
            {participators.find((item) => item.userID === socket.userID)
              ?.role || 'no role'}
          </span>
        </Subheader>
        <Dialog onOpenChange={setShowDialog} open={showDialog}>
          <DialogTrigger asChild>
            <Button
              className=" text-xs"
              onClick={() => setShowDialog(true)}
              variant={'outline'}
            >
              Choose the mark
            </Button>
          </DialogTrigger>
          <DialogContent className="">
            <DialogHeader>
              <DialogTitle className=" text-xl text-center">
                Choose the role
              </DialogTitle>
            </DialogHeader>
            <form
              className=" flex flex-col justify-center items-center gap-4"
              action={handleSubmit}
            >
              <div className="grid grid-cols-2 place-items-center gap-x-4 w-full h-full">
                <PrimaryButton
                  type="submit"
                  className=" w-fit h-fit text-6xl hover:scale-110 transition-all"
                  name="role"
                  value="x"
                  variant="ghost"
                >
                  <RxCross2 />
                </PrimaryButton>
                <PrimaryButton
                  type="submit"
                  className=" w-fit h-fit text-6xl hover:scale-110 transition-all"
                  name="role"
                  value="o"
                  variant="ghost"
                >
                  <RxCircle />
                </PrimaryButton>
                <span className=" font-thin">1-st player</span>
                <span className=" font-thin">2-nd player</span>
              </div>
              <div className=" w-full text-center relative before:absolute before:content-[''] before:w-full before:h-[1px] before:top-1/2 before:left-0 before:bg-foreground before:opacity-50 rounded">
                <span className=" relative h-full min-w-fit px-5 bg-background">
                  OR
                </span>
              </div>
              <PrimaryButton
                type="submit"
                className="text-lg w-full"
                name="role"
                value="no role"
                variant="outline"
              >
                No role
              </PrimaryButton>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <Subheader className=" text-base">
          Room: <span className=" font-light italic">{roomnameURLQuery}</span>
        </Subheader>
        <div className="flex gap-2 items-center justify-center">
          {[...participators]
            .sort((a, b) => (a.userID === socket.userID ? 1 : -1))
            .map((user) => {
              return (
                <Subheader className="text-base" key={user.userID}>
                  {user.username} -{' '}
                  <span className=" font-light italic">
                    {user.role ? user.role : 'no role'}
                  </span>
                </Subheader>
              );
            })}
        </div>
      </div>
    </div>
  );
}
