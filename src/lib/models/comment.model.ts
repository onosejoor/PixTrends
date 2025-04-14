import mongoose, { Model, model, Schema, Types } from "mongoose";

interface IComment {
  post: Types.ObjectId;
  user: Types.ObjectId;
  content: string;
}

const commentSchema = new Schema<IComment>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    content: { type: String, required: true },
    post: [{ type: Schema.Types.ObjectId, required: true, ref: "Post" }],
  },
  {
    timestamps: true,
  },
);

commentSchema.index({ post: 1, user: 1 });

const Comment: Model<IComment> =
  mongoose.models?.Comment || model<IComment>("Comment", commentSchema);

export default Comment;
