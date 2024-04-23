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

  io.on('connection', (socket) => {
    console.log(socket.id, 'has connected');
    console.log(socket.rooms, 'socket rooms');

    /* room creation */
    socket.on('create-game', async ({ roomname, password }, callback) => {
      socket.join(roomname);
      console.log(socket.rooms);
      const roomData = {
        id: socket.id,
        room: roomname,
        isPrivate: password ? true : false,
        amount: (await io.in(roomname).fetchSockets()).length,
      };

      /* send info about room to all connected sockets */
      socket.broadcast.emit('new-room', roomData);

      callback({ status: 200 });
    });

    /* chat */
    socket.on('chat message', ({ username, message, roomname }, callback) => {
      const data = {
        username,
        message,
      };

      io.to(roomname).emit('chat message', data);

      callback({ status: 200, username, message });
    });
  });

  expressApp.post('/api/form-username-submit', async (req, res) => {
    await new Promise((r) => setTimeout(r, 2000));
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
