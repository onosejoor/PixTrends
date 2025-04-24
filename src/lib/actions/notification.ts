"use server";

import { Notification } from "../models";
import { veryfySession } from "./session";
import { onlineUsers } from "@/app/api/notifications/stream/online_users";

type NotificationProps = {
  reciever: string;
  type: INotification["type"];
  postId?: string;
};

export async function sendNotification({
  reciever,
  type,
  postId,
}: NotificationProps) {
  try {
    const { userId } = await veryfySession();

    const notification = new Notification({
      reciever,
      sender: userId,
      type,
      postId,
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
