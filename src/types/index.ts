export interface IRoomParticipator {
  userID: string;
  username: string;
  role?: 'x' | 'o';
}

export interface IRoom {
  roomname: string;
  participators: IRoomParticipator[] | never[];
}

export interface IResponseFromServer {
  success: boolean;
  description: string;
}
