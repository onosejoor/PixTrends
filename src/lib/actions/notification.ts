"use server";

import axios from "axios";
import { Notification } from "../models";
import { verifySession } from "./session";

const SERVER_URL = process.env.SERVER_URL!;

type NotificationProps = {
  reciever: string;
  type: INotification["type"];
  postId?: string;
  commentId?: string;
};

type ApiResponse = {
  success: boolean;
  message: string;
};

export async function sendNotification({
  reciever,
  type,
  postId,
  commentId,
}: NotificationProps) {
  try {
    const { userId } = await verifySession();

    const payload = {
      reciever,
      sender: userId,
      type,
      postId,
      commentId,
    };

    const sendPayload = await axios.post<ApiResponse>(SERVER_URL, payload);

    const { success, message } = sendPayload.data;

    return { success, message };
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
