import { verifySession } from "@/lib/actions/session";
import { Post } from "@/lib/models";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = await verifySession();
  const searchParams = req.nextUrl.searchParams;

  const { page, limit, query } = Object.fromEntries(searchParams.entries()) as {
    page: string;
    limit: string;
    query: string;
  };

  const nextPage = Number(page) || 1;
  const limitValue = Number(limit) || 10;
  try {
    if (query) {
      const posts = await Post.aggregate([
        { $sample: { size: limitValue } },
        {
          $match: {
            $and: [{ username: { $ne: null } }],
            $or: [{ content: { $regex: query, $options: "i" } }],
          },
        },
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
              $in: [new Types.ObjectId(userId as string), "$likes"],
            },
            isUser: {
              $eq: ["$user._id", new Types.ObjectId(userId as string)],
            },
          },
        },
        { $sort: { likesCount: -1, viewsCount: -1 } },

        { $limit: limitValue },
        { $skip: (nextPage - 1) * limitValue },

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
      ]);
      return NextResponse.json(
        { success: true, posts, userId },
        { status: 200 },
      );
    }

    const posts = await Post.aggregate([
      { $sample: { size: limitValue } },
      { $match: { user: { $ne: userId } } },
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
            $in: [new Types.ObjectId(userId as string), "$likes"],
          },
          isUser: { $eq: ["$user._id", new Types.ObjectId(userId as string)] },
        },
      },
      { $sort: { likesCount: -1, viewsCount: -1 } },

      { $limit: limitValue },
      { $skip: (nextPage - 1) * limitValue },

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
    ]);

    return NextResponse.json({ success: true, posts, userId }, { status: 200 });
  } catch (error) {
    console.log("[GET_TRENDING_POSTS_ERROR]: ", error);

    return NextResponse.json(
      { success: false, message: "Internal error" },
      { status: 500 },
    );
  }
}
