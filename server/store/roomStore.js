/* abstract */ class RoomStore {
  findRoom(roomname) {}
  findAllRooms() {}
  saveRoom(roomname, roomData) {}
  updateRoom(roomname, roomData) {}
  deleteRoom(roomname) {}
}

/**
 * @typedef {Object} Participator
 * @property {string} username - The username of the participator.
 * @property {string} userID - The userID of the participator.
 */

/**
 * @typedef {Object} Room
 * @property {string} roomname - The name of the room.
 * @property {string} password - The password for the room.
 * @property {number[]} gameState - The game state of the room.
 * @property {Participator[]} participators - The list of participators in the room.
 * @property {string|null} x - The X role of the participator.
 * @property {string|null} o - The O role of the participator.
 * @property {string|null} whoseTurn - Indicates whose turn it is.
 */

class InMemoryRoomStore extends RoomStore {
  constructor() {
    super();
    this.rooms = new Map();
  }

  /** Receives roomname and returns the room with same name.
   * @param {string} roomname indicates name of socket.io room;
   * @returns {Room}
   */
  findRoom(roomname) {
    return this.rooms.get(roomname);
  }

  /** Returns an array of rooms.
   * @returns {Room[]}
   */
  findAllRooms() {
    return [...this.rooms.values()];
  }

  /** Creates new room.
   * @param {string} roomname indicates name of socket.io room;
   * @param {Room} roomData indicates data about socket.io room;
   */
  saveRoom(roomname, roomData) {
    this.rooms.set(roomname, roomData);
  }

  /** Updates room data.
   * @param {string} roomname indicates name of socket.io room;
   * @param {Partial<Room>} roomData indicates data about socket.io room;
   */
  updateRoom(roomname, roomData) {
    const existingData = this.rooms.get(roomname);
    const updatedData = { ...existingData, ...roomData };
    this.saveRoom(roomname, updatedData);
  }

  /** Receives roomname and deletes the room with same name.
   * @param {string} roomname indicates name of socket.io room;
   */
  deleteRoom(roomname) {
    this.rooms.delete(roomname);
  }
}

module.exports = {
  InMemoryRoomStore,
};
