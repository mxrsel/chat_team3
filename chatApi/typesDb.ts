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