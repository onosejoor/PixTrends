import { Post } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("user", "_id avatar username")
      .lean();

    return NextResponse.json({ success: true, data: posts }, { status: 200 });
  } catch (error) {
    console.log("[GET_RECENT_POSTS_ERROR]: ", error);

    return NextResponse.json(
      { success: false, message: "Internal error" },
      { status: 500 },
    );
  }
}
