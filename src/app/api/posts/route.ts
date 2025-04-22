import { veryfySession } from "@/lib/actions/session";
import { Post } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await veryfySession();
    const searchParams = req.nextUrl.searchParams;

    const { page, limit } = Object.fromEntries(searchParams.entries()) as {
      page: string;
      limit: string;
    };

    const nextPage = Number(page) || 1;
    const limitValue = Number(limit) || 10;

    const getPost = await Post.find({})
      .populate("user", ["-password", "-email"])
      .limit(limitValue)
      .sort({ createdAt: -1 })
      .skip((nextPage - 1) * limitValue);

    return NextResponse.json({ success: true, posts: getPost, userId });
  } catch (error) {
    console.log("[GET_HOME_POSTS_ERROR]:", error);

    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { isAuth, userId, username } = await veryfySession();

    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: "unauthorized!" },
        { status: 401 },
      );
    }

    const { text, images } = (await req.json()) as {
      text?: string;
      images?: string[];
    };

    if (!text && !images) {
      return NextResponse.json(
        { success: false, message: "Either text, or images must be filled!" },
        { status: 400 },
      );
    }

    const newPost = new Post({
      user: userId,
      content: text,
      images,
    });

    await newPost.save();

    const link = `/${username}/posts/${newPost.id}`;

    return NextResponse.json({
      success: true,
      message: "Post has been created",
      link,
    });
  } catch (error) {
    console.log("[CREATE_NEW_POST_ERROR]:", error);

    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
