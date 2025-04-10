import mongoose, { Model, model, Schema, Types } from "mongoose";

interface IUser {
  name: string;
  email: string;
  password: string;
  avatar: string;
  username: string;
  folowers: Types.ObjectId[];
  following: Types.ObjectId[];
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      default:
        "http://res.cloudinary.com/dog3ihaqs/image/upload/v1741877054/mq56g3xeifvoe7rhtnmz.jpg",
      required: false,
    },
    username: { type: String, required: true, unique: true, sparse: true },
    folowers: [{ type: Types.ObjectId, ref: "User" }],
    following: [{ type: Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  },
);

userSchema.index({ email: 1, username: 1 });

const User: Model<IUser> =
  mongoose.models?.User || model<IUser>("User", userSchema);

export default User;
