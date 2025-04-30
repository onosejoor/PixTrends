import mongoose, { Schema, model, Types } from "mongoose";

interface IView {
  post: Types.ObjectId;
  user: Types.ObjectId;
}

const viewSchema = new Schema<IView>(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

viewSchema.index({ post: 1, user: 1 }, { unique: true });
viewSchema.index({ post: 1 });

const View = mongoose.models?.View || model<IView>("View", viewSchema);
export default View;
