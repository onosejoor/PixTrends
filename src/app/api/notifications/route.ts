import { veryfySession } from "@/lib/actions/session";
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
    const { userId, isAuth } = await veryfySession();

    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: "User not authorised" },
        { status: 401 },
      );
    }

    const notifications = await Notification.find({
      reciever: userId,
    })
      .populate("sender", ["-password", "-email"])
      .sort({ createdAt: -1 })
      .skip((nextPage - 1) * pageLimit)
      .limit(pageLimit);

    await Notification.updateMany({ reciever: userId }, { isRead: true });

    return NextResponse.json({ success: true, notifications }, { status: 200 });
  } catch (error) {
    console.log("[GET_NOTIFICATION_ERROR]:", error);
    return NextResponse.json(
      { success: false, message: "Internal error" },
      { status: 500 },
    );
  }
}
