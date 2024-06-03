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

/** Calculates the winner.
 * @param {number[][]} array indicates current game state;
 * @param {number} fieldSize indicates the size of field;
 * @returns {number | null}
 */
const calculateWinner = (array, fieldSize = 3) => {
  if (!array || !array.length || array.length !== fieldSize) {
    throw Error('Field size and game field do not match, or array = undefined');
  }

  /* recursion; created to optimize vertical_&_diagonal search logic for gamefield of any size; shift is need for diagonally check */
  function recursiveCheck(index, nextIndex, shift = 0) {
    /* check if nextValue is undefined (need to understand when the game field will end) */
    if (array.flat()[nextIndex] === undefined) {
      return true;
    }

    /* check if firstValue and nextValue are valid AND if firstValue === nextValue */
    if (
      array.flat()[index] &&
      array.flat()[nextIndex + shift] &&
      array.flat()[index] === array.flat()[nextIndex + shift]
    ) {
      /* 
        shift is responsible for checking gamefield diagonally. logic will look like a stairs;
        for example (values in '()' are arguments for function):
      
        2-1-2                                     (2)-1-2                                                  2-1-2
        1-2-1 => first call: we pass indexes of > (1)-2-1 => second call (recursive): we pass indexes of > 1-(2)-1 (with shift already)
        1-0-2                                      1-0-2                                                   1-(0)-2 (with shift already)
       */
      if (shift !== 0) {
        return recursiveCheck(
          nextIndex + shift,
          nextIndex + fieldSize + shift,
          shift
        );
      }
      return recursiveCheck(nextIndex, nextIndex + fieldSize, shift);
    }
    return false;
  }

  /* vertical check */
  for (let i = 0; i < array.length; i++) {
    if (recursiveCheck(i, i + fieldSize)) {
      console.log('vertical win');
      return array.flat()[i];
    }
  }

  /* horizontal check */
  for (let i = 0; i < array.length; i++) {
    if (array[i].every((item) => array[i][0] && item && item === array[i][0])) {
      console.log('horizontal win');
      return array[i][0];
    }
  }

  /* left-top-corner-diagonal check */
  if (recursiveCheck(0, 0 + fieldSize, 1)) {
    console.log('left-corner-diagonal win');
    return array.flat()[0];
  }

  /* right-top-corner-diagonal check */
  if (recursiveCheck(fieldSize - 1, fieldSize - 1 + fieldSize, -1)) {
    console.log('right-corner-diagonal win');
    return array.flat()[fieldSize - 1];
  }

  return null;
};

module.exports = {
  randomId,
  hashPassword,
  comparePasswords,
  getInfoAboutUsersInRoom,
  calculateWinner,
};
