import { socket } from '@/socket';

export function joinRoom(roomname: Omit<FormDataEntryValue, 'File'>) {
  if (!roomname) {
    return {
      success: false,
      description: 'No room name provided!',
    };
  }

  const promise: Promise<{ success: boolean; description: string }> =
    new Promise((resolve, reject) => {
      socket.emit(
        'join room',
        { roomname },
        (response: { success: boolean; description: string }) => {
          resolve(response);
        }
      );
    });

  return promise;
}
