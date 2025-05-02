import { Post, User } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{ username: string }>;
};

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const username = (await params).username;
    const searchParams = req.nextUrl.searchParams;

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

    const getPost = await Post.find({ user: checkUser._id })
      .limit(limitValue)
      .skip((nextPage - 1) * limitValue)
      .sort({ createdAt: -1 })
      .populate("user", ["-password", "-email"])
      .lean();

    return NextResponse.json({
      success: true,
      posts: getPost,
    });
  } catch (error) {
    console.log("[GET_USER_POSTS_ERROR]: ", error);
    return NextResponse.json(
      { success: false, message: "Internal Error" },
      { status: 500 },
    );
  }
}
