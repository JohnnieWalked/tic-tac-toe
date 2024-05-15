const express = require('express');
const next = require('next');
const { Server } = require('socket.io');

/* middlewares and utils */
const bodyParser = require('body-parser');
const { sessionMiddleware } = require('./middleware');

/* helpers */
const { hashPassword, getInfoAboutUsersInRoom } = require('./helpers/index');

/* store */
const { InMemorySessionStore } = require('./store/sessionStore');
const { InMemoryRoomStore } = require('./store/roomStore');

/* schemas */
const { FormSchema } = require('./schemas/index');

const hostname = 'localhost';
const port = 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const sessionStore = new InMemorySessionStore();
const roomStore = new InMemoryRoomStore();
const socketEvents = {
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

app.prepare().then(() => {
  const expressApp = express();
  expressApp.use(bodyParser.urlencoded({ extended: false }));
  expressApp.use(bodyParser.json());

  const expressServer = expressApp.listen(port);
  const io = new Server(expressServer);

  io.use((socket, next) => {
    sessionMiddleware(socket, sessionStore, next);
  });

  io.on('connection', (socket) => {
    /* persist session */
    sessionStore.saveSession(socket.sessionID, {
      userID: socket.userID,
      username: socket.username,
      connected: true,
    });

    /* emit session details */
    socket.emit(socketEvents.SESSION, {
      sessionID: socket.sessionID,
      userID: socket.userID,
      username: socket.username,
    });

    /* join the "userID" (userID is public ID) room */
    socket.join(socket.userID);

    // fetch existing users
    const users = [];
    sessionStore.findAllSessions().forEach((session) => {
      users.push({
        userID: session.userID,
        username: session.username,
        connected: session.connected,
      });
    });
    socket.emit(socketEvents.USERS, users);

    /* fetch existing rooms */
    socket.on(socketEvents.ROOMS, (callback) => {
      const rooms = [];
      roomStore.findAllRooms().forEach((room) => {
        rooms.push({
          id: room.roomname,
          roomname: room.roomname,
          isPrivate: !!room.password,
          amount: room.participators.length,
        });
      });
      callback(rooms);
    });

    // notify existing users
    socket.broadcast.emit(socketEvents.USER_CONNECTED, {
      userID: socket.userID,
      username: socket.username,
      connected: true,
    });

    /* game room creation */
    socket.on(
      socketEvents.CREATE_GAME,
      async ({ roomname, password }, callback) => {
        /* check if room with this name already exists */
        if (roomStore.findRoom(roomname)) {
          return callback({
            success: false,
            description: 'Room with this name already exists!',
          });
        }

        socket.join(roomname);

        const participators = await getInfoAboutUsersInRoom(io, roomname);
        roomStore.saveRoom(roomname, {
          roomname: roomname,
          password: password ? await hashPassword(password) : '',
          gameState: [
            [
              [0, 0, 0],
              [0, 0, 0],
              [0, 0, 0],
            ],
          ],
          participators: participators,
        });

        const roomData = {
          id: socket.userID + roomname,
          roomname: roomname,
          isPrivate: !!password,
          amount: participators.length,
        };

        /* send info about room to all connected sockets (except room host) */
        socket.broadcast.emit(socketEvents.ROOM_UPDATE, roomData);

        callback({ success: true });
      }
    );

    /* join room */
    socket.on(socketEvents.JOIN_ROOM, async ({ roomname }, callback) => {
      const room = roomStore.findRoom(roomname);
      if (!room) {
        return callback({
          success: false,
          description: 'Room does not exist!',
        });
      }

      /* We need to check for current socket in roomStoreMemory, because user can refresh page and will leave room but WILL NOT leave room in roomStoreMemory */
      if (room.participators.find((user) => user.userID === socket.userID)) {
        socket.join(roomname);
        return callback({
          success: true,
          description: 'Reconnected successfully!',
        });
      }

      if (room.participators.length === 2) {
        return callback({
          success: false,
          description: 'Room is full!',
        });
      }

      socket.join(roomname);
      const participators = await getInfoAboutUsersInRoom(io, roomname);
      roomStore.updateRoom(roomname, { participators: participators });

      /* prepare updated info about room  */
      const updatedDataForRoom = {
        roomname: roomname,
        amount: participators.length,
      };

      /* send to all connected clients updated info about room */
      io.emit(socketEvents.ROOM_UPDATE, updatedDataForRoom);

      return callback({
        success: true,
        description: 'Joined successfully!',
      });
    });

    /* send chat message */
    socket.on(
      socketEvents.CHAT_MESSAGE,
      ({ message, roomname, introduction = false }) => {
        const data = {
          username: socket.username,
          userID: socket.userID,
          message,
        };
        if (introduction) {
          data.introduction = true;
        }

        io.to(roomname).emit(socketEvents.CHAT_MESSAGE, data);
      }
    );

    /* listen for users in room */
    socket.on('users in room', async ({ roomname }) => {
      const participators = await getInfoAboutUsersInRoom(io, roomname);
      io.to(roomname).emit('users in room', participators);
    });

    /* leave room */
    socket.on('leave room', async ({ roomname }, callback) => {
      const room = roomStore.findRoom(roomname);
      if (!room) {
        return callback({
          success: false,
          description: 'Room does not exist!',
        });
      }
      /* prepare data about user that will leave */
      const data = {
        username: socket.username,
        userID: socket.userID,
        abandon: true,
      };
      /* send msg about leaving room */
      io.to(roomname).emit(socketEvents.CHAT_MESSAGE, data);
      socket.leave(roomname);

      /* get up-to-date users data in room */
      const participators = await getInfoAboutUsersInRoom(io, roomname);

      /* delete room if there are no users left there */
      if (participators.length === 0) {
        roomStore.deleteRoom(roomname);
      } else {
        roomStore.updateRoom(roomname, { participators: participators });
        /* send new data about participators in the room */
        io.to(roomname).emit('users in room', participators);
      }

      /* update data about room and send updated data about room to all clients */
      const updatedDataForRoom = {
        roomname: roomname,
        amount: participators.length,
      };
      io.emit(socketEvents.ROOM_UPDATE, updatedDataForRoom);

      callback({ status: 200 });
    });

    /* notify users upon disconnection */
    socket.on('disconnect', async () => {
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
  });

  expressApp.post('/api/form-username-submit', async (req, res) => {
    const result = FormSchema.safeParse({
      username: req.body.username,
    });

    if (!result.success) {
      res.status(400).json({
        errors: result.error.flatten().fieldErrors,
      });
    } else {
      res.status(200).json(result.data.username).end();
    }
  });

  expressApp.get('*', (req, res) => {
    return handler(req, res);
  });
});
