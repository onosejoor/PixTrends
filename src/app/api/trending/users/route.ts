import { User } from "@/lib/models";
import { PipelineStage } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const query = searchParams.get("query");
  try {
    const getUsers = await User.aggregate(
      buildPostAggregationPipeline({ query }),
    );

    return NextResponse.json({ success: true, users: getUsers });
  } catch (error) {
    console.log("[GET_TRENDING_USERS_ERROR]: ", error);
    return NextResponse.json(
      { success: false, message: "Error fetching trending users" },
      { status: 500 },
    );
  }
}
function buildPostAggregationPipeline({
  query,
}: {
  query: string | null;
}): PipelineStage[] {
  const matchStage = query
    ? {
        $or: [
          { username: { $regex: query, $options: "i" } },
          { name: { $regex: query, $options: "i" } },
        ],
      }
    : null;

  return [
    {
      $match: {
        $and: [{ username: { $ne: null } }],
        ...(matchStage && matchStage),
      },
    },
    {
      $addFields: {
        followersCount: { $size: "$followers" },
      },
    },
    { $sort: { followersCount: -1 } },
    { $limit: 4 },

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
  ];
}
