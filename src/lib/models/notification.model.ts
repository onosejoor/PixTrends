import mongoose, { Model, model, Schema, Types } from "mongoose";

interface INotification {
  sender: Types.ObjectId;
  reciever: Types.ObjectId;
  type: string;
  isRead: boolean;
  postId: Types.ObjectId;
  commentId: Types.ObjectId;
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
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      required: false,
      default: null,
    },
    type: {
      type: String,
      required: true,
      enum: ["like", "follow", "reply", "comment"],
    },
    isRead: { type: Boolean, required: false, default: false },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({ reciever: 1, createdAt: -1 });
notificationSchema.index({ commentId: 1 });

const Notification: Model<INotification> =
  mongoose.models?.Notification ||
  model<INotification>("Notification", notificationSchema);

export default Notification;
