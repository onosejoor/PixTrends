import { User } from "@/lib/models";
import { NextResponse } from "next/server";



export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const username = (await params).username;

    const getUser = await User.findOne({ username })
      .select(["-password", "-email"])
      .lean();

    if (!getUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, user: getUser },
      { status: 200 },
    );
  } catch (error) {
    console.log("[GET_[USERNAME]_USER_ERROR]: ", error);

    return NextResponse.json(
      { success: false, message: "Error getting user" },
      { status: 500 },
    );
  }
}
