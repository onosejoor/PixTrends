import { verifySession } from "@/lib/actions/session";
import { Notification } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const { page, limit } = Object.fromEntries(searchParams) as {
    page: string;
    limit: string;
  };

  const nextPage = parseInt(page) || 1;
  const pageLimit = parseInt(limit) || 20;

  try {
    const { userId, username } = await verifySession();

    const notifications = await Notification.find({
      receiver: userId,
    })
      .populate([
        {
          path: "sender",
          select: ["name", "_id", "username", "avatar"],
        },
        { path: "postId", select: ["_id", "content", "images"] },
        { path: "commentId", select: ["_id", "content"] },
      ])
      .sort({ createdAt: -1 })
      .skip((nextPage - 1) * pageLimit)
      .limit(pageLimit);

    if (notifications.some(({ isRead }) => !isRead)) {
      await Notification.updateMany({ receiver: userId }, { isRead: true });
    }

    return NextResponse.json(
      { success: true, notifications, username },
      { status: 200 },
    );
  } catch (error) {
    console.log("[GET_NOTIFICATION_ERROR]:", error);
    return NextResponse.json(
      { success: false, message: "Internal error" },
      { status: 500 },
    );
  }
}
