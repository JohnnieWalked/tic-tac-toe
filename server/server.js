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

app.prepare().then(() => {
  const expressApp = express();
  expressApp.use(bodyParser.urlencoded({ extended: false }));
  expressApp.use(bodyParser.json());

  const expressServer = expressApp.listen(port);
  const io = new Server(expressServer);

  io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error('invalid username'));
    }
    socket.username = username;
    next();
  });

  io.on('connection', (socket) => {
    console.log(socket.username);

    /* fetch all users */
    const users = [];
    for (let [id, socket] of io.of('/').sockets) {
      users.push({
        userID: id,
        username: socket.username,
      });
    }
    console.log(users);

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
        id: socket.id,
        room: roomname,
        amount: (await io.in(roomname).fetchSockets()).length,
      };

      /* send info about room to all connected sockets (except room host) */
      socket.broadcast.emit('room event', roomData);

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
        id: room.values().next().value /* get host id (will be always first) */,
        room: roomname,
        amount: 2,
      };

      /* send to all connected clients updated info about room */
      io.emit('room event', updatedDataForRoom);

      return callback({
        success: true,
        description: 'Joined successfully!',
      });
    });

    /* chat */
    socket.on('chat message', ({ message, roomname }) => {
      const data = {
        username: socket.username,
        message,
      };

      io.to(roomname).emit('chat message', data);
    });

    /* leave room */
    socket.on('leave room', ({ roomname }, callback) => {
      socket.leave(roomname);
      console.log(socket.rooms);
      callback({ status: 200 });
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
