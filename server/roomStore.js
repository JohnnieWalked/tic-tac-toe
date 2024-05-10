/* abstract */ class RoomStore {
  findRoom(id) {}
  saveRoom(roomname, password) {}
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

  saveRoom(roomname, password) {
    this.rooms.set(roomname, password);
  }

  deleteRoom(roomname) {
    this.rooms.delete(roomname);
  }
}

module.exports = {
  InMemoryRoomStore,
};
