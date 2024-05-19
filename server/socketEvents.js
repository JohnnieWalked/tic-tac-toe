const socketEvents = {
  SESSION: 'session',
  USERS: 'users',
  ROOMS: 'rooms',
  ROOM_UPDATE: 'room update',
  USER_CONNECTED: 'user connected',
  USER_DISCONNECTED: 'user disconnected',
  USERS_IN_ROOM: 'users in room',
  DISCONNECT: 'disconnect',
  CREATE_GAME: 'create game',
  JOIN_ROOM: 'join room',
  LEAVE_ROOM: 'leave room',
  CHAT_MESSAGE: 'chat message',
  IS_ROOM_PRIVATE: 'is room private',
};

module.exports = {
  socketEvents,
};
