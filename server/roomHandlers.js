/* helpers */
const {
  hashPassword,
  getInfoAboutUsersInRoom,
  comparePasswords,
  calculateWinner,
} = require('./helpers/index');
const { socketEvents } = require('./socketEvents');
/* types */
const { Server, Socket } = require('socket.io');
const { InMemoryRoomStore } = require('./store/roomStore');
const { FIELD_SIZE } = require('./constants');

/**
 *
 * @param {Server} io
 * @param {Socket} socket
 * @param {InMemoryRoomStore} roomStore
 */
module.exports = (io, socket, roomStore) => {
  /** fetching existing rooms and sending to client. */
  const allRooms = () => {
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
  };

  /** game room creation */
  const createRoom = () => {
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
        const hashedPassword = await hashPassword(password);
        roomStore.saveRoom(roomname, {
          roomname: roomname,
          password: hashedPassword,
          gameState: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
          ],

          participators: participators,
          x: null,
          o: null,
          whoseTurn: null,
          winner: null,
          rematchVotes: [],
        });

        const roomData = {
          id: socket.userID + roomname,
          roomname: roomname,
          isPrivate: !!password,
          amount: participators.length,
        };

        /* send info about room to all connected sockets (except room host) */
        socket.broadcast.emit(socketEvents.ROOM_UPDATE, roomData);

        callback({
          success: true,
          description: 'Lobby has been created.',
          hashedPassword,
        });
      }
    );
  };

  /** join room */
  const joinRoom = () => {
    socket.on(
      socketEvents.JOIN_ROOM,
      async ({ roomname, password = '' }, callback) => {
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

        /* if room is protected by password -> compare password with hash */
        if (room.password) {
          const passwordMatch = await comparePasswords(password, room.password);
          if (!passwordMatch) {
            return callback({
              success: false,
              description: 'Incorrect password!',
            });
          }
        }

        socket.join(roomname);
        const participators = await getInfoAboutUsersInRoom(io, roomname);
        roomStore.updateRoom(roomname, { participators: participators });

        /* prepare updated info about room  */
        const updatedDataForRoom = {
          roomname: roomname,
          amount: participators.length,
        };

        /* send notification about user */
        const data = {
          username: socket.username,
          userID: socket.userID,
          introduction: true,
        };
        io.to(roomname).emit(socketEvents.CHAT_MESSAGE, data);

        /* send to all connected clients updated info about room */
        io.emit(socketEvents.ROOM_UPDATE, updatedDataForRoom);

        return callback({
          success: true,
          hashedPassword: room.password,
          description: 'Joined successfully!',
        });
      }
    );
  };

  /** check if room requires password */
  const isRoomPrivate = () => {
    socket.on(socketEvents.IS_ROOM_PRIVATE, async ({ roomname }, callback) => {
      const room = roomStore.findRoom(roomname);
      if (!room) {
        return callback({
          success: false,
          description: 'Room does not exist!',
        });
      }
      if (room.password) {
        return callback(true);
      } else {
        callback(false);
      }
    });
  };

  /** leave room */
  const leaveRoom = () => {
    socket.on(socketEvents.LEAVE_ROOM, async ({ roomname }, callback) => {
      const room = roomStore.findRoom(roomname);
      if (!room) {
        return callback({
          success: false,
          description: 'Room does not exist!',
        });
      }
      /* prepare data about user that are going to leave */
      const data = {
        username: socket.username,
        userID: socket.userID,
        abandon: true,
      };
      /* send msg about user who left */
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
        io.to(roomname).emit(socketEvents.USERS_IN_ROOM, participators);
      }

      /* update data about room and send updated data about room to all clients */
      const updatedDataForRoom = {
        roomname: roomname,
        amount: participators.length,
      };
      io.emit(socketEvents.ROOM_UPDATE, updatedDataForRoom);

      callback({ status: 200 });
    });
  };

  /* listen for users in room */
  const listenRoomUsers = () => {
    socket.on(socketEvents.USERS_IN_ROOM, ({ roomname }) => {
      const room = roomStore.findRoom(roomname);
      if (!room) return;

      const participators = room.participators;
      io.to(roomname).emit(socketEvents.USERS_IN_ROOM, participators);
    });
  };

  /* send chat message */
  const handleMessageSend = () => {
    socket.on(socketEvents.CHAT_MESSAGE, ({ message, roomname }) => {
      const data = {
        username: socket.username,
        userID: socket.userID,
        message,
      };

      io.to(roomname).emit(socketEvents.CHAT_MESSAGE, data);
    });
  };

  /* role selection */
  const selectRole = () => {
    socket.on(
      socketEvents.ROLE_SELECTION,
      ({ selectedRole, roomname }, callback) => {
        const room = roomStore.findRoom(roomname);
        if (!room) {
          return callback({
            success: false,
            description: 'Room does not exist!',
          });
        }

        /* check if user is a part of the room */
        if (!room.participators.find((user) => user.userID === socket.userID)) {
          return callback({
            success: false,
            description: 'Something went wrong...',
          });
        }

        /* if role is 'x' or 'o' -> check availability of roles */
        if (selectedRole !== 'no role') {
          /* if role already has a value -> check it */
          if (room[selectedRole]) {
            if (socket.userID === room[selectedRole]) {
              return callback({
                success: true,
                description: 'You have already selected this role!',
              });
            }
            return callback({
              success: false,
              description: 'This role is already taken!',
            });
          }

          /* change whoseTurn if state of the gamefield is empty (before game begins) */
          /* gamefield consists of array of numbers -> (0 - empty square; 1 - square with "X" mark; 2 - with "O" mark) */
          if (room.gameState.flat().every((item) => item === 0)) {
            if (selectedRole === 'x') {
              room.whoseTurn = socket.userID;
            }
          } else {
            return callback({
              success: false,
              description:
                'You can not change role during the game! Please, try again before starting the game.',
            });
          }

          /* clear role 'X' or 'O' if user was assigned to one of them */
          if (room.x === socket.userID) {
            room.x = null;
          }
          if (room.o === socket.userID) {
            room.o = null;
          }
          /* assign user to specific role */
          room[selectedRole] = socket.userID;

          /* if role does NOT have a value -> update roomStore data */
          roomStore.updateRoom(roomname, { ...room });
        } else {
          /* if user selected 'no role' -> find if room.x or room.o has socket.userID and update value */
          if (room.x === socket.userID) {
            room.x = null;
            roomStore.updateRoom(roomname, { x: null });
          }
          if (room.o === socket.userID) {
            room.o = null;
            roomStore.updateRoom(roomname, { o: null });
          }
          if (room.whoseTurn === socket.userID) {
            roomStore.updateRoom(roomname, { whoseTurn: null });
          }
        }

        const data = {
          x: room.x,
          o: room.o,
        };
        io.to(roomname).emit(socketEvents.ROOM_ROLES, data);

        return callback({
          success: true,
          description: 'Role has been successfully assigned!',
        });
      }
    );
  };

  /* listen for room roles */
  const roomRoles = () => {
    socket.on(socketEvents.ROOM_ROLES, ({ roomname }) => {
      const room = roomStore.findRoom(roomname);
      if (!room) return;

      const data = {
        x: room.x,
        o: room.o,
      };
      io.to(roomname).emit(socketEvents.ROOM_ROLES, data);
    });
  };

  /* listen for changes in game field */
  const listenGameField = () => {
    socket.on(socketEvents.WATCH_GAMESTATE, ({ roomname }) => {
      const room = roomStore.findRoom(roomname);
      if (!room) return;

      const data = {
        gameState: room.gameState,
      };
      io.to(roomname).emit(socketEvents.WATCH_GAMESTATE, data);
    });
  };

  /* handle place mark */
  const handlePlaceMark = () => {
    socket.on(
      socketEvents.PLACE_MARK,
      ({ roomname, pressedSquareIndex }, callback) => {
        const room = roomStore.findRoom(roomname);
        if (!room) return;

        if (room.winner) {
          return callback({
            success: true,
            description: 'Game over! But you can still have a rematch.',
          });
        }

        if (room.x !== socket.userID && room.o !== socket.userID) {
          return callback({
            success: false,
            description: 'You have not selected the mark!',
          });
        }

        if (room.whoseTurn !== socket.userID) {
          return callback({
            success: false,
            description: 'Wait for your opponent`s move!',
          });
        }

        /*
        1 indicates first player ("X" mark)
        2 indicates seconds player ("O" mark)
        */
        const socketSelectedRole = room.x === socket.userID ? 1 : 2;
        const newGameState = structuredClone(room.gameState);
        const foundSquareUsingIndex = newGameState
          .flat()
          .find((item, index) => index === pressedSquareIndex);

        if (foundSquareUsingIndex !== 0) {
          return callback({
            success: false,
            description: 'This square has been already marked!',
          });
        }

        /* 
          find which row need to be selected 
          logic:
          1) on client-side squares are rendered one by one (from 0 to 9 (depends on FIELD_SIZE))
          2) client presses the specific square and server recieves an index of pressed square
          3) because of room.gameState is an array of array ([[],[],[]]) we need to know where the square we need was pressed
          4) to get row (top, mid or bottom line) we use "/" (example -> 5 / 3 = ~1.6 -> result index 1 (second row))
          5) to get col - we use "%" (example -> 5 % 3 = 2 (remainder is 2 so we need value with index 2))
          6) pressedSqureIndex = 5 -> row - 1, col - 2 -> room.gameState[1][2] = user's role (X or O (1 or 2))
        */
        const targetRowIndex = Math.floor(pressedSquareIndex / FIELD_SIZE);

        /* find which col need to be selected */
        const targetColIndex = pressedSquareIndex % FIELD_SIZE;

        newGameState[targetRowIndex][targetColIndex] = socketSelectedRole;

        const winner = calculateWinner(newGameState, FIELD_SIZE);

        /* update game state and update turn (find user that is not assigned to whoseTurn and assign his userID to whoseTurn) */
        roomStore.updateRoom(roomname, {
          gameState: newGameState,
          whoseTurn: room.participators.find(
            (item) => item.userID !== room.whoseTurn
          ).userID,
          winner: winner ? winner : null,
        });

        console.log(roomStore.findRoom(roomname));

        const data = {
          gameState: newGameState,
        };

        if (winner) {
          const data = {
            winner:
              winner === 1
                ? room.participators.find((item) => item.userID === room.x)
                    .username
                : room.participators.find((item) => item.userID === room.o)
                    .username,
          };
          io.to(roomname).emit(socketEvents.WINNER, data);
        }

        io.to(roomname).emit(socketEvents.WATCH_GAMESTATE, data);
      }
    );
  };

  /* vote for rematch */
  const handleRematchVotes = () => {
    socket.on(socketEvents.REMATCH_VOTE, ({ roomname }, callback) => {
      const room = roomStore.findRoom(roomname);
      if (!room) return;

      if (room.rematchVotes.find((item) => item.userID === socket.userID)) {
        return callback({
          success: false,
          description:
            'You have already voted. Please, wait for opponent to vote.',
        });
      }

      const newRematchVotes = [
        ...room.rematchVotes,
        { userID: socket.userID, username: socket.username },
      ];

      /* if votes === 2 -> reset game */
      if (newRematchVotes.length === 2) {
        const resetedGameState = [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ];
        roomStore.updateRoom(roomname, {
          rematchVotes: [],
          gameState: resetedGameState,
          winner: null,
          whoseTurn: room.x,
        });

        const data = {
          gameState: resetedGameState,
        };

        io.to(roomname).emit(socketEvents.WATCH_GAMESTATE, data);
        io.to(roomname).emit(socketEvents.VOTES, []);
      } else {
        roomStore.updateRoom(roomname, { rematchVotes: newRematchVotes });
        io.to(roomname).emit(socketEvents.VOTES, newRematchVotes);
      }

      return callback({
        success: true,
        description: 'Successfully voted!',
      });
    });
  };

  /* listen how many users vote to rematch */
  const listenForRematchVotes = () => {
    socket.on(socketEvents.VOTES, ({ roomname }) => {
      const room = roomStore.findRoom(roomname);
      if (!room) return;

      io.to(roomname).emit(socketEvents.VOTES, room.rematchVotes);
    });
  };

  allRooms();
  createRoom();
  joinRoom();
  leaveRoom();
  listenRoomUsers();
  handleMessageSend();
  isRoomPrivate();
  selectRole();
  roomRoles();
  listenGameField();
  handlePlaceMark();
  handleRematchVotes();
  listenForRematchVotes();
};
