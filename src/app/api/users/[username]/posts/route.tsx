import { posts } from "@/dummy";
import { User } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{ username: string }>;
};

export async function GET(req: NextRequest, { params }: Params) {
  const username = (await params).username;
  const searchParams = req.nextUrl.searchParams;

  const { page, limit } = Object.fromEntries(searchParams.entries()) as {
    page: string;
    limit: string;
  };

  const nextPage = Number(page) || 1;
  const limitValue = Number(limit) || 10;

  const checkUser = await User.findOne({ username });

  if (!checkUser) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 },
    );
  }

  const getPost = posts.slice((nextPage - 1) * limitValue, limitValue);

  return NextResponse.json({ success: true, posts: getPost });
}
