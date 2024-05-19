const { socketEvents } = require('./socketEvents');
const { Server, Socket } = require('socket.io');
const { InMemorySessionStore } = require('./store/sessionStore');

/**
 *
 * @param {Server} io
 * @param {Socket} socket
 * @param {InMemorySessionStore} sessionStore
 */
module.exports = (io, socket, sessionStore) => {
  /** persist session; save to sessionStore */
  const saveSessionToStore = () => {
    sessionStore.saveSession(socket.sessionID, {
      userID: socket.userID,
      username: socket.username,
      connected: true,
    });
  };

  /** emit session details */
  const sendSessionToClient = () => {
    socket.emit(socketEvents.SESSION, {
      sessionID: socket.sessionID,
      userID: socket.userID,
      username: socket.username,
    });
  };

  /** join the "userID" (userID is public ID) room */
  const joinUserID = () => {
    socket.join(socket.userID);
  };

  /** send existing users to the client */
  const sendAllUsers = () => {
    const users = [];
    sessionStore.findAllSessions().forEach((session) => {
      users.push({
        userID: session.userID,
        username: session.username,
        connected: session.connected,
      });
    });
    socket.emit(socketEvents.USERS, users);
  };

  /** notify existing users about connected socket */
  const broadcastConnection = () => {
    socket.broadcast.emit(socketEvents.USER_CONNECTED, {
      userID: socket.userID,
      username: socket.username,
      connected: true,
    });
  };

  /** notify users upon disconnection */
  const socketDisconnect = () => {
    socket.on(socketEvents.DISCONNECT, async () => {
      const matchingSockets = await io.in(socket.userID).allSockets();
      const isDisconnected = matchingSockets.size === 0;
      if (isDisconnected) {
        // notify other users
        socket.broadcast.emit(socketEvents.USER_DISCONNECTED, socket.userID);
        // update the connection status of the session
        sessionStore.saveSession(socket.sessionID, {
          userID: socket.userID,
          username: socket.username,
          connected: false,
        });
      }
    });
  };

  saveSessionToStore();
  sendSessionToClient();
  joinUserID();
  sendAllUsers();
  broadcastConnection();
  socketDisconnect();
};
