export interface IUser {
  _id: string;
  fullname: string;
  email: string;
  avatar: string;
  coverImage?: string;
  watchHistory?: any[];
  createdAt: Date;
  updatedAt: Date;
}
