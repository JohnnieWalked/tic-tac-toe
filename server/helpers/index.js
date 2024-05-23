const crypto = require('crypto');
const bcryptjs = require('bcryptjs');
const { Server } = require('socket.io');

const randomId = () => crypto.randomBytes(8).toString('hex');
const hashPassword = async (password) =>
  password ? await bcryptjs.hash(password, 10) : '';
const comparePasswords = async (password, hashedPassword) =>
  await bcryptjs.compare(password, hashedPassword);

/** Get up-to-date info about sockets in room.
 * @param {Server} io indicates socket.io server;
 * @param {string} roomname indicates name of socket.io room;
 * @returns {Promise<import('../store/roomStore').Participator[]>}
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

/** Check if current role is free to use.
 * @param {import('../store/roomStore').Room} room indicates room from roomStore;
 * @param {string} roleToCheck indicates role;
 * @returns {boolean}
 */
const isRoleFree = (roomRole, roleToCheck) => {};

module.exports = {
  randomId,
  hashPassword,
  comparePasswords,
  getInfoAboutUsersInRoom,
};
