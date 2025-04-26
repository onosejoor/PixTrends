import { verifySession } from "@/lib/actions/session";
import { NextRequest, NextResponse } from "next/server";
import {
  addUserToOnlineUsers,
  removeUserFromOnlineUsers,
} from "./online_users";

export async function GET(req: NextRequest) {
  try {
    const { userId, isAuth } = await verifySession();

    if (!isAuth) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const stream = new ReadableStream({
      start(controller) {
        addUserToOnlineUsers(userId as string, controller);

        req.signal.addEventListener("abort", () => {
          removeUserFromOnlineUsers(userId as string);
          controller.close();
        });
      },
    });

    console.log("User connected:", userId);

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("[REAL_TIME_NOTIFICATION_GET_ERROR]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
