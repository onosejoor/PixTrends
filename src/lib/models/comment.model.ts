import mongoose, { Model, model, Schema, Types } from "mongoose";

interface IComment {
  post: Types.ObjectId;
  user: Types.ObjectId;
  content: string;
}

const commentSchema = new Schema<IComment>(
  {
    user: { type: Schema.Types.ObjectId, required: true },
    content: { type: String, required: false, default: "" },
    post: [{ type: Schema.Types.ObjectId, required: true }],
  },
  {
    timestamps: true,
  },
);

commentSchema.index({ post: 1, user: 1 });

const Post: Model<IComment> =
  mongoose.models?.Post || model<IComment>("Post", commentSchema);

export default Post;
