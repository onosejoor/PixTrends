import { verifySession } from "@/lib/actions/session";
import { User } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await verifySession();

    const getUsers = await User.aggregate([
      { $match: { _id: { $ne: userId } } },
      { $sample: { size: 3 } },
      { $limit: 3 },

      {
        $project: {
          _id: 1,
          name: 1,
          username: 1,
          avatar: 1,
          followers: 1,
          following: 1,
          bio: 1,
        },
      },
    ]);

    return NextResponse.json({ success: true, users: getUsers });
  } catch (error) {
    console.log("[POST_TRENDING_USERS_ERROR]: ", error);
    return NextResponse.json(
      { success: false, message: "Error fetching trending users" },
      { status: 500 },
    );
  }
}
