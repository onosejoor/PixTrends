import mongoose, { Model, model, Schema, Types } from "mongoose";

interface INotification {
  sender: Types.ObjectId;
  reciever: Types.ObjectId;
  type: string;
  isRead: boolean;
  postId: Types.ObjectId;
}

const notificationSchema = new Schema<INotification>(
  {
    reciever: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: false,
      default: null,
    },
    type: { type: String, required: true, alias: ["like", "follow", "reply", "comment"] },
    isRead: { type: Boolean, required: false, default: false },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({ reciever: -1 });

const Notification: Model<INotification> =
  mongoose.models?.Notification ||
  model<INotification>("Notification", notificationSchema);

export default Notification;
