import { Types } from "mongoose";

declare global {
  var mongoose: any;

  interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    avatar: string;
    bio: string;
    username: string;
    folowers: Types.ObjectId[];
    following: Types.ObjectId[];
    createdAt: Date;
  }

  interface IPost {
    _id: Types.ObjectId;
    user: IUser;
    content: string;
    images: string[];
    likes: Types.ObjectId[];
    comments: number;
    createdAt: Date;
  }

  interface IComment {
    _id: Types.ObjectId;
    post: IPost;
    user: IUser;
    content: string;
    replies: IComment[];
    parentId?: Types.ObjectId;
    createdAt: Date;
  }

  interface IOTP {
    _id: Types.ObjectId;
    email: string;
    otp: string;
    createdAt: Date;
  }
}
