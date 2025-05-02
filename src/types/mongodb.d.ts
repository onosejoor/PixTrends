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
    followers: Types.ObjectId[];
    following: Types.ObjectId[];
    createdAt: Date;
  }

  interface IUserPreview {
    _id: Types.ObjectId;
    name: string;
    avatar: string;
    bio: string;
    username: string;
    followers: Types.ObjectId[];
    following: Types.ObjectId[];
    createdAt: Date;
  }

  interface IPost {
    _id: Types.ObjectId;
    user: IUserPreview;
    content: string;
    images: string[];
    likes: Types.ObjectId[];
    comments: number;
    isLiked?: boolean;
    isUser?: boolean;
    createdAt: Date;
    views: Types.ObjectId[];
  }

  interface IComment {
    _id: Types.ObjectId;
    post: IPost;
    user: IUserPreview;
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

  interface INotification {
    _id: Types.ObjectId;
    createdAt: Date;
    sender: IUserPreview;
    receiver: IUserPreview;
    type: "like" | "follow" | "reply" | "comment";
    postId: IPost | null;
    commentId: IComment | null;
    isRead: boolean;
  }
}
