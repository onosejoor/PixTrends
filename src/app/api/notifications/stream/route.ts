import { veryfySession } from "@/lib/actions/session";
import { NextRequest, NextResponse } from "next/server";
import {
  addUserToOnlineUsers,
  removeUserFromOnlineUsers,
} from "./online_users";

export async function GET(req: NextRequest) {
  try {
    const { userId, isAuth } = await veryfySession();

    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: "Unauthorised" },
        { status: 401 },
      );
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
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.log("[REAL_TIME_NOTIFICATION_GET_ERROR]: ", error);
    return NextResponse.json(
      { success: false, message: "Internal error" },
      { status: 500 },
    );
  }
}

// export async function POST(req: NextRequest) {
//   try {
//     const { userId, isAuth } = await veryfySession();

//     if (!isAuth) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorised" },
//         { status: 401 },
//       );
//     }

//     const { receiverId, type, message } = await req.json();

//     const notification = new Notification({
//       type,
//       message,
//       sender: userId,
//       receiver: receiverId,
//     });

//     await notification.save();

//     const controller = onlineUsers.get(receiverId);
//     if (controller) {
//       controller.enqueue(`data: ${JSON.stringify(notification)}\n\n`);
//       return new NextResponse("Notification sent in real-time", {
//         status: 201,
//       });
//     } else {
//       console.log("User is offline");
//       return NextResponse.json(
//         { success: true, message: "Notification stored for offline user" },
//         { status: 201 },
//       );
//     }
//   } catch (error) {
//     console.log("[REAL_TIME_NOTIFICATION_POST_ERROR]: ", error);
//     return NextResponse.json(
//       { success: false, message: "Internal error" },
//       { status: 500 },
//     );
//   }
// }
