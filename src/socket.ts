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
  USERS_IN_ROOM: 'users in room',
  CREATE_GAME: 'create game',
  JOIN_ROOM: 'join room',
  LEAVE_ROOM: 'leave room',
  CHAT_MESSAGE: 'chat message',
  IS_ROOM_PRIVATE: 'is room private',
  ROLE_SELECTION: 'role selection',
  ROOM_ROLES: 'room roles',
  WATCH_GAMESTATE: 'watch gamestate',
  PLACE_MARK: 'place mark',
  WINNER: 'winner',
};

socket.onAny((event, ...args) => {
  console.log(event, args);
});
