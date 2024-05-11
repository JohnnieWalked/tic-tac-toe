/* abstract */ class RoomStore {
  findRoom(roomname) {}
  findAllRooms() {}
  saveRoom(roomname, roomData) {}
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

  deleteRoom(roomname) {
    this.rooms.delete(roomname);
  }
}

module.exports = {
  InMemoryRoomStore,
};
