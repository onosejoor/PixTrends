import { verifySession } from "@/lib/actions/session";
import { Post } from "@/lib/models";
import { PipelineStage, Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = await verifySession();
  const searchParams = req.nextUrl.searchParams;

  const { page, limit, query } = Object.fromEntries(searchParams.entries()) as {
    page: string;
    limit: string;
    query: string;
  };

  const nextPage = parseInt(page) || 1;
  const limitValue = parseInt(limit) || 10;
  const userObjectId = new Types.ObjectId(userId as string);

  try {
    const posts = await Post.aggregate(
      buildPostAggregationPipeline({
        userObjectId,
        skip: (nextPage - 1) * limitValue,
        limit: limitValue,
        query,
      }),
    );

    return NextResponse.json({ success: true, posts, userId }, { status: 200 });
  } catch (error) {
    console.log("[GET_TRENDING_POSTS_ERROR]: ", error);

    return NextResponse.json(
      { success: false, message: "Internal error" },
      { status: 500 },
    );
  }
}

function buildPostAggregationPipeline({
  userObjectId,
  skip,
  limit,
  query,
}: {
  userObjectId: Types.ObjectId;
  skip: number;
  limit: number;
  query?: string;
}): PipelineStage[] {
  const matchStage = query
    ? {
        $match: {
          $or: [{ content: { $regex: query, $options: "i" } }],
        },
      }
    : null;

  return [
    ...(matchStage ? [matchStage] : []),

    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $addFields: {
        likesCount: { $size: "$likes" },
        viewsCount: { $size: "$views" },
        isLiked: {
          $in: [userObjectId, "$likes"],
        },
        isUser: {
          $eq: ["$user._id", userObjectId],
        },
      },
    },
    { $sort: { likesCount: -1, viewsCount: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $project: {
        content: 1,
        createdAt: 1,
        images: 1,
        comments: 1,
        likes: 1,
        isLiked: 1,
        isUser: 1,
        views: 1,
        "user._id": 1,
        "user.username": 1,
        "user.avatar": 1,
      },
    },
  ];
}
