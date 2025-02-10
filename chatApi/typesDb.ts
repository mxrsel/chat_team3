export interface UserFields {
  username: string;
  password: string;
  token: string;
  role: string;
  isOnline: boolean;
}

export interface Online {
  _id: string;
  username: string;
}

export interface IncomingMessages {
  type: string;
  payload: string;
}

export interface ChatMessage {
  onlineUser: string;
  text: string
}