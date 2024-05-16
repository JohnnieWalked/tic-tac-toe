const crypto = require('crypto');
const bcryptjs = require('bcryptjs');
const { Server } = require('socket.io');

const randomId = () => crypto.randomBytes(8).toString('hex');
const hashPassword = async (password) => await bcryptjs.hash(password, 10);

/** Gets up-to-date info about sockets in room.
 * @param {Server} io indicates socket.io server;
 * @param {string} roomname indicates name of socket.io room;
 */
const getInfoAboutUsersInRoom = async (io, roomname) => {
  const socketsInRoom = await io.in(roomname).fetchSockets();
  if (!socketsInRoom) {
    return [];
  }
  const participators = [];
  socketsInRoom.forEach((socket) => {
    participators.push({
      username: socket.username,
      userID: socket.userID,
    });
  });
  return participators;
};

module.exports = {
  randomId,
  hashPassword,
  getInfoAboutUsersInRoom,
};
