import { User } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const query = searchParams.get("query");
  try {
    if (query) {
      const getUsers = await User.aggregate([
        {
          $match: {
            $and: [{ username: { $ne: null } }],
            $or: [
              { username: { $regex: query, $options: "i" } },
              { name: { $regex: query, $options: "i" } },
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

      return NextResponse.json({ success: true, users: getUsers });
    }

    const getUsers = await User.aggregate([
      {
        $match: {
          $and: [{ username: { $ne: null } }],
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

    return NextResponse.json({ success: true, users: getUsers });
  } catch (error) {
    console.log("[GET_TRENDING_USERS_ERROR]: ", error);
    return NextResponse.json(
      { success: false, message: "Error fetching trending users" },
      { status: 500 },
    );
  }
}
