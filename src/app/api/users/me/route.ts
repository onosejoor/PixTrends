import { verifySession } from "@/lib/actions/session";
import { Notification } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { isAuth, userId, username } = await verifySession();

    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: "User Not Authenticated" },
        { status: 401 },
      );
    }

    const unreadNotifications = await Notification.countDocuments({
      reciever: userId,
      isRead: false,
    });

    return NextResponse.json(
      { success: true, userId, username, unreadNotifications },
      { status: 200 },
    );
  } catch (error) {
    console.log("[GET_CURRENT_USER_ERROR]:", error);
    return NextResponse.json(
      { success: false, message: "Internal Error" },
      { status: 500 },
    );
  }
}
