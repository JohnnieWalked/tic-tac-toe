'use client';

import { io, Socket } from 'socket.io-client';

interface ExtendedSocket extends Socket {
  userID: string;
  username: string;
  currentGameRoom: {
    roomname: string;
    password: string;
  };
}

const extendedSocket = io({ autoConnect: false }) as ExtendedSocket;
export const socket: ExtendedSocket = extendedSocket;

socket.onAny((event, ...args) => {
  console.log(event, args);
});
