'use client';

import { DetailedHTMLProps, HTMLAttributes, useEffect, useState } from 'react';
import { socket } from '@/socket';
import { useToast } from './ui/use-toast';

/* rtk */
import { useAppSelector, useAppDispatch } from '@/hooks/hooks';
import { UserInfo, userSliceActions } from '@/store/slices/userSlice';

function StatusBar(
  props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) {
  const dispatch = useAppDispatch();
  const { username } = useAppSelector((state) => state.userSlice);
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState<boolean>();
  const [transport, setTransport] = useState('N/A');

  useEffect(() => {
    const sessionID = localStorage.getItem('sessionID');

    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
    }

    socket.on('session', ({ sessionID, userID, username }) => {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem('sessionID', sessionID);
      // save the ID of the user
      socket.userID = userID;
      // save the username of the user
      socket.username = username;
      dispatch(userSliceActions.setUsername(socket.username));
    });
  }, [dispatch]);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }
    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      socket.io.engine.on('upgrade', (transport) => {
        setTransport(transport.name);
      });
    }
    function onDisconnect() {
      setIsConnected(false);
      setTransport('N/A');
    }
    function updateAllUsersData(data: UserInfo[]) {
      dispatch(userSliceActions.updateAllUsersData(data));
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('users', (data: UserInfo[]) => updateAllUsersData(data));
    socket.on('user connected', (data: UserInfo) => updateAllUsersData([data]));
    socket.on('user disconnected', (userID: string) =>
      dispatch(userSliceActions.userDisconnected(userID))
    );

    socket.on('connect_error', (err) => {
      if (err.message === 'invalid username') {
        toast({
          title: 'Error!',
          variant: 'destructive',
          description: 'Invalid username!',
        });
      }
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error');
      socket.off('users');
      socket.off('user connected');
      socket.off('user disconnected');
    };
  }, [dispatch, toast]);

  return (
    <div {...props}>
      <div>
        Username:{' '}
        <span
          className={`font-bold ${
            username ? 'uppercase' : 'text-red-700 font-light'
          }`}
        >
          {username ? username : '<blank>'}
        </span>
      </div>
      <div>
        Status:{' '}
        <span
          className={` font-light ${
            isConnected ? 'text-green-600' : 'text-red-700'
          }`}
        >
          {isConnected ? 'connected' : 'disconnected'}
        </span>
      </div>
    </div>
  );
}

export default StatusBar;
