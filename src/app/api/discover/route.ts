import { verifySession } from "@/lib/actions/session";
import { Post, User } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const { page, limit } = Object.fromEntries(searchParams);

  const nextPage = parseInt(page) || 1;
  const docLimit = parseInt(limit) || 10;

  try {
    const { userId, isAuth } = await verifySession();

    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: "User not authorised" },
        { status: 401 },
      );
    }

    const getUser = await User.findById(userId);

    const posts = await Post.aggregate([
      { $match: { user: { $in: getUser?.following } } },
      { $sample: { size: docLimit } },
      { $skip: (nextPage - 1) * docLimit },
      { $limit: docLimit },
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
        $project: {
          content: 1,
          createdAt: 1,
          "user._id": 1,
          "user.name": 1,
          "user.username": 1,
          "user.avatar": 1,
        },
      },
    ]);

    return NextResponse.json({ success: true, posts }, { status: 200 });
  } catch (error) {
    console.log("[GET_USER_FOLLOWING_ERROR]: ", error);

    return NextResponse.json(
      { success: false, message: "Internal error" },
      { status: 500 },
    );
  }
}
