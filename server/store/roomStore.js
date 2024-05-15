/* abstract */ class RoomStore {
  findRoom(roomname) {}
  findAllRooms() {}
  saveRoom(roomname, roomData) {}
  updateRoom(roomname, roomData) {}
  deleteRoom(roomname) {}
}

class InMemoryRoomStore extends RoomStore {
  constructor() {
    super();
    this.rooms = new Map();
  }

  /** Receives roomname and returns the room with same name.
   * @param {string} roomname indicates name of socket.io room;
   * @returns {{roomname: string, password: string, gameState: [][], participators: [{username: string, userID: string}]}}
   */
  findRoom(roomname) {
    return this.rooms.get(roomname);
  }

  /** Returns an array of rooms.
   * @returns {{roomname: string, password: string, gameState: [][], participators: [{username: string, userID: string}]}[]}
   */
  findAllRooms() {
    return [...this.rooms.values()];
  }

  /** Creates new room.
   * @param {string} roomname indicates name of socket.io room;
   * @param {{roomname: string, password: string, gameState: [][], participators: [{username: string, userID: string}]}} roomData indicates name of socket.io room;
   */
  saveRoom(roomname, roomData) {
    this.rooms.set(roomname, roomData);
  }

  /** Updates room data.
   * @param {string} roomname indicates name of socket.io room;
   * @param {{roomname: string, password: string, gameState: [][], participators: [{username: string, userID: string}]}} roomData indicates name of socket.io room;
   */
  updateRoom(roomname, roomData) {
    const existingData = this.rooms.get(roomname);
    const updatedData = { ...existingData, ...roomData };
    this.saveRoom(roomname, updatedData);
  }

  /** Receives roomname and deletes the room with same name.
   * @param {string} roomname indicates name of socket.io room;
   * @returns {{roomname: string, password: string, gameState: [][], participators: [{username: string, userID: string}]}}
   */
  deleteRoom(roomname) {
    this.rooms.delete(roomname);
  }
}

module.exports = {
  InMemoryRoomStore,
};
