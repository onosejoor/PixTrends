import mongoose, { Schema, model, Types, Model } from "mongoose";

interface ILike {
  post: Types.ObjectId;
  user: Types.ObjectId;
}

const likeSchema = new Schema<ILike>(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

likeSchema.index({ post: 1, user: 1 }, { unique: true });

const Like: Model<ILike> = mongoose.models?.Like || model<ILike>("Like", likeSchema);
export default Like;
