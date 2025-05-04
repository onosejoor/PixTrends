import { verifySession } from "@/lib/actions/session";
import { Post, User } from "@/lib/models";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{ username: string }>;
};

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const username = (await params).username;
    const searchParams = req.nextUrl.searchParams;

    const { userId } = await verifySession();

    const { page, limit } = Object.fromEntries(searchParams.entries()) as {
      page: string;
      limit: string;
    };

    const nextPage = Number(page) || 1;
    const limitValue = Number(limit) || 10;

    const checkUser = await User.exists({ username });

    if (!checkUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const getPosts = await Post.aggregate([
      { $match: { user: checkUser._id } },
      { $sample: { size: limitValue } },

      {
        $skip: (nextPage - 1) * limitValue,
      },
      {
        $limit: limitValue,
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $addFields: {
          isLiked: {
            $in: [new Types.ObjectId(userId as string), "$likes"],
          },
          isUser: { $eq: ["$user._id", new Types.ObjectId(userId as string)] },
        },
      },
      {
        $project: {
          content: 1,
          createdAt: 1,
          images: 1,
          comments: 1,
          isUser: 1,
          likes: 1,
          isLiked: 1,
          views: 1,
          "user._id": 1,
          "user.username": 1,
          "user.avatar": 1,
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      posts: getPosts,
    });
  } catch (error) {
    console.log("[GET_USER_POSTS_ERROR]: ", error);
    return NextResponse.json(
      { success: false, message: "Internal Error" },
      { status: 500 },
    );
  }
}
