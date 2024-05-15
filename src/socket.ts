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

export const socketEvents = {
  SESSION: 'session',
  USERS: 'users',
  ROOMS: 'rooms',
  ROOM_UPDATE: 'room update',
  USER_CONNECTED: 'user connected',
  USER_DISCONNECTED: 'user disconnected',
  CREATE_GAME: 'create game',
  JOIN_ROOM: 'join room',
  CHAT_MESSAGE: 'chat message',
};

socket.onAny((event, ...args) => {
  console.log(event, args);
});
