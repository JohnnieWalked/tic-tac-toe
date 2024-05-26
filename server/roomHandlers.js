/* helpers */
const {
  hashPassword,
  getInfoAboutUsersInRoom,
  comparePasswords,
} = require('./helpers/index');
const { socketEvents } = require('./socketEvents');
/* types */
const { Server, Socket } = require('socket.io');
const { InMemoryRoomStore } = require('./store/roomStore');

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
            [
              [0, 0, 0],
              [0, 0, 0],
              [0, 0, 0],
            ],
          ],
          participators: participators,
          x: null,
          o: null,
          whoseTurn: null,
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
          if (room.x === socket.userID) {
            room.x = null;
          }
          if (room.o === socket.userID) {
            room.o = null;
          }
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

  allRooms();
  createRoom();
  joinRoom();
  leaveRoom();
  listenRoomUsers();
  handleMessageSend();
  isRoomPrivate();
  selectRole();
  roomRoles();
};
