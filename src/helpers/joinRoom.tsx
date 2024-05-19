import { socket, socketEvents } from '@/socket';

export function joinRoom(roomname: string, password?: string) {
  if (!roomname) {
    return {
      success: false,
      description: 'No room name provided!',
    };
  }

  const promise: Promise<{
    success: boolean;
    description: string;
    hashedPassword?: string;
  }> = new Promise((resolve, reject) => {
    socket.emit(
      socketEvents.JOIN_ROOM,
      { roomname, password },
      (response: {
        success: boolean;
        hashedPassword?: string;
        description: string;
      }) => {
        resolve(response);
      }
    );
  });

  return promise;
}
