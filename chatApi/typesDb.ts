export interface UserFields {
  username: string;
  password: string;
  token: string;
  role: string;
  isOnline: boolean;
}

export interface Online {
  token: string;
  username: string;
}

export interface IncomingMessage {
  type: string;
  payload: string;
}