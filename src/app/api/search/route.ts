// this code can be used to search, or you use the search server action

import { verifySession } from "@/lib/actions/session";
import { User } from "@/lib/models";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("query") || "";

  if (!query.trim()) {
    return NextResponse.json(
      { success: false, message: "Query is required" },
      { status: 400 },
    );
  }

  try {
    const { userId } = await verifySession();

    const getPeople = await User.aggregate([
      { $sample: { size: 5 } },
      {
        $match: {
          $and: [{ _id: { $ne: new Types.ObjectId(userId as string) } }],
          $or: [
            { username: { $regex: query, $options: "i" } },
            { name: { $regex: query, $options: "i" } },
          ],
        },
      },
      { $limit: 5 },
      {
        $addFields: {
          followersCount: { $size: "$followers" },
        },
      },
      { $sort: { followersCount: -1 } },
      {
        $project: {
          _id: 1,
          username: 1,
          name: 1,
          avatar: 1,
          followers: 1,
          following: 1,
          bio: 1,
        },
      },
    ]);

    return NextResponse.json(
      { success: true, people: getPeople },
      { status: 200 },
    );
  } catch (error) {
    console.log("[SEARCH_ERROR]", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
