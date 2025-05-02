import { verifySession } from "@/lib/actions/session";
import { Post } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await verifySession();

    const id = (await params).id;

    const findPost = await Post.findById(id)
      .populate<{ user: IUser }>("user", ["name", "_id", "username", "avatar"])
      .lean();

    if (!findPost) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 },
      );
    }

    const isLiked = !!findPost?.likes.some((like) =>
      like.equals(userId as string),
    );
    const isUser = findPost.user._id.equals(userId as string);
    const post = { ...findPost, isLiked, isUser };

    return NextResponse.json({
      success: true,
      post: post,
    });
  } catch (error) {
    console.log("[GET_POST_BY_ID_ERROR]:", error);

    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
