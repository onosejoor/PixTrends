import { verifySession } from "@/lib/actions/session";
import { User } from "@/lib/models";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await verifySession();

    const getSuggestedUsers = await User.aggregate([
      {
        $match: {
          $and: [
            { _id: { $ne: new Types.ObjectId(userId as string) } },
            { followers: { $ne: new Types.ObjectId(userId as string) } },
            { following: { $ne: new Types.ObjectId(userId as string) } },
          ],
        },
      },
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

    return NextResponse.json({ success: true, data: getSuggestedUsers });
  } catch (error) {
    console.log("[GET_SUGGESTED_USERS_ERROR]: ", error);
    return NextResponse.json(
      { success: false, message: "Error fetching trending users" },
      { status: 500 },
    );
  }
}
