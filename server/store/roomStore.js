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

  findRoom(roomname) {
    return this.rooms.get(roomname);
  }

  findAllRooms() {
    return [...this.rooms.values()];
  }

  saveRoom(roomname, roomData) {
    this.rooms.set(roomname, roomData);
  }

  /** Updates room data.
   * @param {string} roomname indicates name of socket.io room;
   * @param {{roomname: string, password: string, gameState: [][], participators: [{username: string, userID: string}]}} roomData indicates name of socket.io room;
   */
  updateRoom(roomname, roomData) {
    if (this.rooms.has(roomname)) {
      const existingData = this.rooms.get(roomname);
      const updatedData = { ...existingData, ...roomData };
      this.saveRoom(roomname, updatedData);
      return true;
    }
    return false;
  }

  deleteRoom(roomname) {
    this.rooms.delete(roomname);
  }
}

module.exports = {
  InMemoryRoomStore,
};
