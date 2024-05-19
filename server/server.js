const express = require('express');
const next = require('next');

/* socket */
const { Server } = require('socket.io');
const { socketEvents } = require('./socketEvents');

/* handlers */
const sessionHandlers = require('./sessionHandlers');
const roomHandlers = require('./roomHandlers');

/* middlewares and utils */
const bodyParser = require('body-parser');
const { sessionMiddleware } = require('./middleware');

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
    sessionHandlers(io, socket, sessionStore);
    roomHandlers(io, socket, roomStore);
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
