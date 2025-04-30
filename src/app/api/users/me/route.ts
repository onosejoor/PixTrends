import { verifySession } from "@/lib/actions/session";
import { Notification, User } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

type PayLoad = {
  name: string;
  email: string;
  avatar: string;
  bio: string;
};

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
      receiver: userId,
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

export async function PUT(req: NextRequest) {
  const { name, email, avatar, bio } = (await req.json()) as PayLoad;

  try {
    const { isAuth, userId, username } = await verifySession();

    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: "User Not Authenticated" },
        { status: 401 },
      );
    }

    await User.findByIdAndUpdate(userId, {
      name,
      email,
      avatar,
      bio,
    });

    return NextResponse.json(
      { success: true, message: "User profile updated successfully", username },
      { status: 200 },
    );
  } catch (error) {
    console.log("[PUT_USERDATA_ERROR]:", error);
    return NextResponse.json(
      { success: false, message: "Internal Error" },
      { status: 500 },
    );
  }
}
