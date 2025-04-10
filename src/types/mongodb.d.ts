import { Types } from "mongoose";

declare global {
  var mongoose: any;

  interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    avatar: string;
    username: string;
    folowers: Types.ObjectId[];
    following: Types.ObjectId[];
    createdAt: Date;
  }

  interface IPost {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    content: string;
    images: string[];
    likes: Types.ObjectId[];
    comments: number;
    createdAt: Date;
  }

  interface IComment {
    _id: Types.ObjectId;
    post: Types.ObjectId;
    user: Types.ObjectId;
    content: string;
    createdAt: Date;
  }

  interface IOTP {
    _id: Types.ObjectId;
    email: string;
    otp: string;
    createdAt: Date;
  }
}
