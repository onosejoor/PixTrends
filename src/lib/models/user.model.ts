import bcrypt from "bcryptjs";
import mongoose, { Model, model, Schema, Types } from "mongoose";

const GOOGLE_CODE = process.env.GOOGLE_CODE;

interface IUser {
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
    username: {
      type: String,
      required: false,
      unique: true,
      trim: true,
      sparse: true,
    },
    bio: { type: String, required: false, default: "" },
    followers: [{ type: Types.ObjectId, ref: "User" }],
    following: [{ type: Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.password === GOOGLE_CODE) {
    return next();
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(this.password, saltRounds);

  this.password = hashedPassword;

  return next();
});

userSchema.index({ email: 1, username: 1 });

const User: Model<IUser> =
  mongoose.models?.User || model<IUser>("User", userSchema);

export default User;
