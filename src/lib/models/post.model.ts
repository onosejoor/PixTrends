import mongoose, { Model, model, Schema, Types } from "mongoose";

interface IPost {
  user: Types.ObjectId;
  content: string;
  images: string[];
  likes: Types.ObjectId[];
  views: Types.ObjectId[];
  comments: number;
  createdAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    content: { type: String, required: false, default: "" },
    comments: { type: Number, required: false, default: 0 },
    images: { type: [String], required: false, default: [] },
    likes: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        default: [],
        ref: "User",
      },
    ],
    views: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        default: [],
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

postSchema.index({ content: "text" });

postSchema.index({ user: 1 });

const Post: Model<IPost> =
  mongoose.models?.Post || model<IPost>("Post", postSchema);

export default Post;
