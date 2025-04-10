import { posts } from "@/dummy";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const { page, limit } = Object.fromEntries(searchParams.entries()) as {
      page: string;
      limit: string;
    };

    const nextPage = Number(page) || 1;
    const limitValue = Number(limit) || 10;

    const getPost = posts.slice((nextPage - 1) * limitValue, limitValue);

    return NextResponse.json({ success: true, posts: getPost });
  } catch (error) {
    console.log("[GET_HOME_POSTS_ERROR]:", error);

    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
