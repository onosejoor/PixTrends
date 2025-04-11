import { veryfySession } from "@/lib/actions/session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { isAuth, userId, username } = await veryfySession();

    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: "User Not Authenticated" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { success: true, userId, username },
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
