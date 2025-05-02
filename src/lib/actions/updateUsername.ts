"use server";

import { User } from "../models";
import { createSession, verifySession } from "./session";

export async function updateUsername(username: string) {
  const { userId } = await verifySession();

  try {
    await Promise.all([
      User.findByIdAndUpdate(userId, {
        username,
      }),
      createSession({ userId: userId as string, username }),
    ]);

    return { success: true, message: "Username updated successfully" };
  } catch (error) {
    console.error("[UPDATE_USERNAME_ERROR] : ", error);
    return { success: false, message: "Internal error" };
  }
}
