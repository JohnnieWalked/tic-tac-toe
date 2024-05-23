'use client';

import { useEffect, useState } from 'react';
import { useToast } from '../ui/use-toast';

/* socket */
import { socket, socketEvents } from '@/socket';

/* ui, components */
import { RxCross2, RxCircle } from 'react-icons/rx';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Subheader from '../common/Subheader';
import { Button } from '../ui/button';
import PrimaryButton from '../common/PrimaryButton';

type RoomControlBarProps = {
  roomnameURLQuery: string;
};

export default function RoomControlBar({
  roomnameURLQuery,
}: RoomControlBarProps) {
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [currentRole, setCurrentRole] = useState<'x' | 'o' | 'no role'>(
    'no role'
  );

  useEffect(() => {
    socket.on(socketEvents.ROOM_ROLES, (data) => {});
  }, [roomnameURLQuery]);

  const handleSubmit = (formData: FormData) => {
    const roleSelected = formData.get('role');

    socket.emit(
      socketEvents.ROLE_SELECTION,
      { currentRole, roomname: roomnameURLQuery },
      (response) => {}
    );

    console.log(roleSelected);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col items-center justify-center gap-3 ">
        <Subheader>
          Current mark:{' '}
          <span className=" font-light italic">{currentRole}</span>
        </Subheader>
        <Dialog onOpenChange={setShowDialog} open={showDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowDialog(true)} variant={'outline'}>
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
        <Subheader>
          Room: <span className=" font-light italic">{roomnameURLQuery}</span>{' '}
        </Subheader>
      </div>
    </div>
  );
}
