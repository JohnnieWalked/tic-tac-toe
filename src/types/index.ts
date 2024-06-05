export interface IRoomParticipator {
  userID: string;
  username: string;
}

export interface IRoom {
  roomname: string;
  participators: IRoomParticipator[] | never[];
  roles: {
    x: string | null;
    o: string | null;
  };
}

export interface IResponseFromServer {
  success: boolean;
  description: string;
}
