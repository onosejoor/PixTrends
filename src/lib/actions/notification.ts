"use server";

import { Notification } from "../models";
import { veryfySession } from "./session";

type NotificationProps = {
  reciever: string;
  type: INotification["type"];
  message: string;
  postId?: string;
};

export async function sendNotification({
  reciever,
  type,
  message,
  postId,
}: NotificationProps) {
  try {
    const { userId } = await veryfySession();
    const notification = new Notification({
      reciever,
      sender: userId,
      message,
      type,
      postId,
    });

    await notification.save();

    return { success: true, message: "notification sent" };
  } catch (error) {
    console.log("[SEND_NOTIFICATION_ERROR]: ", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error sending notification",
    };
  }
}
