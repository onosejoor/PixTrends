import mongoose, { Model, model, Schema, Types } from "mongoose";

interface IComment {
  post: Types.ObjectId;
  user: Types.ObjectId;
  content: string;
  parentId?: Types.ObjectId;
}

const commentSchema = new Schema<IComment>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    content: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
    parentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null }, 
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }, 
  },
);

commentSchema.index({ post: 1, user: 1 });

commentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parentId",
});

const Comment: Model<IComment> =
  mongoose.models?.Comment || model<IComment>("Comment", commentSchema);

export default Comment;
