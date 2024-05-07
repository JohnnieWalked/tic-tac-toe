const express = require('express');
const next = require('next');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const z = require('zod');

const FormSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Must be 1 or more characters long.' })
    .max(20, { message: 'Must be 20 or fewer characters long.' }),
});

const hostname = 'localhost';
const port = 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const crypto = require('crypto');
const randomId = () => crypto.randomBytes(8).toString('hex');

const { InMemorySessionStore } = require('./sessionStore');
const sessionStore = new InMemorySessionStore();

app.prepare().then(() => {
  const expressApp = express();
  expressApp.use(bodyParser.urlencoded({ extended: false }));
  expressApp.use(bodyParser.json());

  const expressServer = expressApp.listen(port);
  const io = new Server(expressServer);

  io.use((socket, next) => {
    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
      // find existing session
      const session = sessionStore.findSession(sessionID);
      if (session) {
        socket.sessionID = sessionID;
        socket.userID = session.userID;
        socket.username = session.username;
        return next();
      }
    }

    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error('invalid username'));
    }

    // create new session
    socket.sessionID = randomId();
    socket.userID = randomId();
    socket.username = username;
    next();
  });

  io.on('connection', (socket) => {
    /* persist session */
    sessionStore.saveSession(socket.sessionID, {
      userID: socket.userID,
      username: socket.username,
      connected: true,
    });

    /* emit session details */
    socket.emit('session', {
      sessionID: socket.sessionID,
      userID: socket.userID,
      username: socket.username,
    });

    /* join the "userID" room */
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
    socket.emit('users', users);

    // notify existing users
    socket.broadcast.emit('user connected', {
      userID: socket.userID,
      username: socket.username,
      connected: true,
    });

    /* room creation */
    socket.on('create game', async ({ roomname }, callback) => {
      /* check if room with this name already exists */
      if (io.sockets.adapter.rooms.get(roomname)) {
        return callback({
          success: false,
          description: 'Room with this name already exists!',
        });
      }

      socket.join(roomname);

      const roomData = {
        id: socket.userID + roomname,
        room: roomname,
        amount: (await io.in(roomname).fetchSockets()).length,
      };

      /* send info about room to all connected sockets (except room host) */
      socket.broadcast.emit('room update', roomData);

      callback({ success: true });
    });

    /* join room */
    socket.on('join room', async ({ roomname }, callback) => {
      /* get set of sockets room if exists */
      const room = io.sockets.adapter.rooms.get(roomname);
      if (!room) {
        return callback({
          success: false,
          description: 'Room does not exist!',
        });
      }

      const amountOfSocketsInRoom = (await io.in(roomname).fetchSockets())
        .length;

      if (amountOfSocketsInRoom === 2) {
        return callback({
          success: false,
          description: 'Room is full!',
        });
      }
      socket.join(roomname);

      /* prepare updated info about room  */
      const updatedDataForRoom = {
        room: roomname,
        amount: 2,
      };

      /* send to all connected clients updated info about room */
      io.emit('room update', updatedDataForRoom);

      return callback({
        success: true,
        description: 'Joined successfully!',
      });
    });

    /* send chat message */
    socket.on('chat message', ({ message, roomname, introduction = false }) => {
      const data = {
        username: socket.username,
        userID: socket.userID,
        message,
      };
      if (introduction) {
        data.introduction = true;
      }

      io.to(roomname).emit('chat message', data);
    });

    /* listen for users in room */
    socket.on('room users', async ({ roomname }) => {
      const socketsInRoom = await io.in(roomname).fetchSockets();
      const participators = [];
      socketsInRoom.forEach((socket) => {
        participators.push({
          username: socket.username,
          userID: socket.userID,
        });
      });
      io.to(roomname).emit('room users', participators);
    });

    /* leave room */
    socket.on('leave room', async ({ roomname }, callback) => {
      /* prepare data about user that will leave */
      const data = {
        username: socket.username,
        userID: socket.userID,
        abandon: true,
      };
      /* send msg about leaving room */
      io.to(roomname).emit('chat message', data);
      socket.leave(roomname);

      /* get up-to-date users data in room */
      const socketsInRoom = await io.in(roomname).fetchSockets();
      const participators = [];
      socketsInRoom.forEach((socket) => {
        participators.push({
          username: socket.username,
          userID: socket.userID,
        });
      });
      /* send new data about participators in the room */
      io.to(roomname).emit('room users', participators);

      /* update data about room */
      const updatedDataForRoom = {
        room: roomname,
        amount: socketsInRoom.length,
      };

      /* send updated data about room */
      io.emit('room update', updatedDataForRoom);

      callback({ status: 200 });
    });

    /* notify users upon disconnection */
    socket.on('disconnect', async () => {
      const matchingSockets = await io.in(socket.userID).allSockets();
      const isDisconnected = matchingSockets.size === 0;
      if (isDisconnected) {
        // notify other users
        socket.broadcast.emit('user disconnected', socket.userID);
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
      res.cookie('username', result.data.username);
      res.status(200).json(result.data.username).end();
    }
  });

  expressApp.get('*', (req, res) => {
    return handler(req, res);
  });
});
