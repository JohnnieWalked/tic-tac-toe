/* abstract */ class RoomStore {
  findRoom(roomName) {}
  saveRoom(roomName, roomData) {}
  deleteRoom(roomName) {}
}

class InMemoryRoomStore extends RoomStore {
  constructor() {
    super();
    this.rooms = new Map();
  }

  findRoom(roomName) {
    return this.rooms.get(roomName);
  }

  saveRoom(roomName, roomData) {
    this.rooms.set(roomName, roomData);
  }

  deleteRoom(roomName) {
    this.rooms.delete(roomName);
  }
}

module.exports = {
  InMemoryRoomStore,
};
