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
import Figure from '../common/Figure';

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
    socket.emit(socketEvents.ROOM_ROLES, { roomname });
    socket.on(socketEvents.ROOM_ROLES, assignRolesToParticipators);

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

  const renderedParticipators = participators.map((user) => {
    return (
      <div
        className="flex items-center justify-center tracking-wide"
        key={user.userID}
      >
        {user.username}: <Figure className=" w-7 h-7 ml-2" role={user.role} />
      </div>
    );
  });

  return (
    <div className="relative grid grid-rows-[minmax(min-content,_auto)_1fr] grid-flow-col gap-y-3 place-items-center">
      <Subheader className="">Current mark </Subheader>
      <div className="flex flex-col justify-between items-center gap-2">
        <Figure
          className=" w-10 h-10"
          role={
            participators.find((item) => item.userID === socket.userID)?.role
          }
        />
        <Dialog onOpenChange={setShowDialog} open={showDialog}>
          <DialogTrigger asChild>
            <Button
              className=""
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
              className=" flex flex-col justify-center items-center gap-7"
              action={handleSubmit}
            >
              <div className="grid grid-cols-2 place-items-center gap-x-4 w-full h-full">
                <PrimaryButton
                  type="submit"
                  className="relative w-full h-20 flex flex-col group/markX transition-all"
                  name="role"
                  value="x"
                  variant="outline"
                >
                  <RxCross2 className=" w-20 h-20 group-hover/markX:rotate-90 transition-all " />
                  <span className="absolute -bottom-1/2 -translate-y-1/2 left-0 w-full text-base scale-0 group-hover/markX:scale-100 transition-all">
                    1-st player
                  </span>
                </PrimaryButton>
                <PrimaryButton
                  type="submit"
                  className=" relative w-full h-20 flex flex-col group/markO transition-all"
                  name="role"
                  value="o"
                  variant="outline"
                >
                  <RxCircle className=" w-20 h-20 group-hover/markO:scale-50 transition-all" />
                  <span className="absolute -bottom-1/2 -translate-y-1/2 left-0 w-full text-base scale-0 group-hover/markO:scale-100 transition-all">
                    2-nd player
                  </span>
                </PrimaryButton>
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

      <Subheader>Room</Subheader>
      <span className=" text-lg tracking-wide text-center">
        {roomnameURLQuery}
      </span>

      <Subheader>Participators</Subheader>
      <div className="flex flex-col items-center justify-center">
        {renderedParticipators}
      </div>
    </div>
  );
}
