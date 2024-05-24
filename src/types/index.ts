export interface IRoomParticipator {
  userID: string;
  username: string;
  role?: string;
}

export interface IRoom {
  roomname: string;
  participators: IRoomParticipator[] | never[];
}

export interface IResponseFromServer {
  success: boolean;
  description: string;
}
