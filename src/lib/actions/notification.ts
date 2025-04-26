"use server";

import { Notification } from "../models";
import { verifySession } from "./session";
import { onlineUsers } from "@/app/api/notifications/stream/online_users";

type NotificationProps = {
  reciever: string;
  type: INotification["type"];
  postId?: string;
  commentId?: string;
};

export async function sendNotification({
  reciever,
  type,
  postId,
  commentId,
}: NotificationProps) {
  try {
    const { userId } = await verifySession();

    const notification = new Notification({
      reciever,
      sender: userId,
      type,
      postId,
      commentId,
    });

    await notification.save();

    const controller = onlineUsers.get(reciever);
    if (controller) {
      controller.enqueue(`data: ${JSON.stringify(notification)}\n\n`);
    }

    return { success: true, message: "Notification sent" };
  } catch (error) {
    console.log("[SEND_NOTIFICATION_ERROR]: ", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error sending notification",
    };
  }
}

export async function deleteNotification(id: string) {
  try {
    await Notification.deleteOne({ _id: id });

    return { success: true, message: "Notification deleted" };
  } catch (error) {
    console.log("[DELETE_NOTIFICATION_ERROR]: ", error);

    return { success: false, message: "internal error" };
  }
}
