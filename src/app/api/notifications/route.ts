import { veryfySession } from "@/lib/actions/session";
import { Notification } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId, isAuth } = await veryfySession();

    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: "User not authorised" },
        { status: 401 },
      );
    }

    const findNotifications = Notification.find({
      reciever: userId,
    }).populate("sender", ["-password", "-email"]);

    const removeUnread = Notification.updateMany(
      { reciever: userId }, 
      { isRead: true },
    );

    const [notifications] = await Promise.all([
      findNotifications,
      removeUnread,
    ]);

    return NextResponse.json({ success: true, notifications }, { status: 200 });
  } catch (error) {
    console.log("[GET_NOYIFICATION_ERROR]:", error);
  }
}
