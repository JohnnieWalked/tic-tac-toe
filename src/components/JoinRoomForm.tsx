'use client';
import React, { useState } from 'react';
import { useToast } from './ui/use-toast';
import { useRouter } from 'next/navigation';
import { socket, socketEvents } from '@/socket';
import { motion } from 'framer-motion';

/* rtk */
import { useAppDispatch } from '@/hooks/hooks';
import { roomSliceActions } from '@/store/slices/roomSlice';

/* helpers */
import { joinRoom } from '@/helpers/joinRoom';

/* ui */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import PrimaryButton from './common/PrimaryButton';
import { IResponseFromServer } from '@/types';

type JoinRoomProps = {
  inputNameAttr: string;
  children?: React.ReactNode;
  className?: string;
};

export default function JoinRoomForm({
  children,
  className,
  inputNameAttr,
}: JoinRoomProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showDialog, setShowDialog] = useState(false);
  const [roomToConnect, setRoomToConnect] = useState('');
  const { toast } = useToast();

  async function connectToRoom(roomname: string, password?: string) {
    const result = await joinRoom(roomname, password);
    if (result.success && 'hashedPassword' in result) {
      dispatch(roomSliceActions.setRoomName(roomname));
      toast({
        title: 'Success!',
        description: result.description,
      });
      return router.push(
        `/new-game/game-room?roomname=${roomname}&?password=${result.hashedPassword}`
      );
    }

    toast({
      title: 'Something went wrong...',
      description: result.description,
      variant: 'destructive',
    });
  }

  const handleDialogForm = async (data: FormData) => {
    const password = data.get('password')?.toString() || '';
    connectToRoom(roomToConnect, password);
  };

  const handleForm = async (data: FormData) => {
    const roomname = data.get(inputNameAttr)?.toString() || '';
    setRoomToConnect(roomname);

    socket.emit(
      socketEvents.IS_ROOM_PRIVATE,
      { roomname },
      (response: boolean | IResponseFromServer) => {
        /* if password is needed -> show modal dialog; if not -> start connecting to the room */
        if (typeof response !== 'object') {
          response ? setShowDialog(true) : connectToRoom(roomname);
        } else {
          toast({
            title: 'Something went wrong...',
            description: response.description,
            variant: 'destructive',
          });
        }
      }
    );
  };

  return (
    <>
      <form className={`${className}`} action={handleForm}>
        {children}
      </form>

      {showDialog && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ease: 'easeInOut', duration: 0.5 }}
        >
          <Dialog onOpenChange={setShowDialog} open={showDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Connecting to{' '}
                  <i className=" text-card-foreground">{roomToConnect}</i>{' '}
                </DialogTitle>
                <DialogDescription>
                  This room is protected by password. Please, enter password to
                  continue.
                </DialogDescription>
              </DialogHeader>
              <form className="flex flex-col gap-3" action={handleDialogForm}>
                <Label htmlFor="password">Password:</Label>
                <Input
                  id="password"
                  name="password"
                  placeholder="Type here..."
                />
                <PrimaryButton type="submit">Connect</PrimaryButton>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>
      )}
    </>
  );
}
